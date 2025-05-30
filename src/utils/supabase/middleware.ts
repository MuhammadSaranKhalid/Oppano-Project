import { type CookieOptions, createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { SUPABASE_KEY, SUPABASE_URL } from "./constants";

export async function updateSession(request: NextRequest) {
  // We create a NextResponse based on the current request, so we can modify cookies.
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Create a supabase client that knows how to get/set cookies on NextRequest/NextResponse.
  const supabase = createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        request.cookies.set({
          name,
          value,
          ...options,
        });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({
          name,
          value,
          ...options,
        });
      },
      remove(name: string, options: CookieOptions) {
        request.cookies.set({
          name,
          value: "",
          ...options,
        });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({
          name,
          value: "",
          ...options,
        });
      },
    },
  });

  // Retrieve the authenticated user.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("User: ", user?.user_metadata);

  // Define allowed authentication paths.
  const authPaths = ["/", "/login", "/signup", "/forgot-password", "/reset-password"];
  const currentPath = request.nextUrl.pathname;

  // For unauthenticated users, allow only auth routes. Otherwise, redirect to /login.
  if (!user) {
    if (authPaths.includes(currentPath)) {
      return response;
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // For authenticated users, if they try to hit an auth route, redirect to the home page.
  if (authPaths.includes(currentPath)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Create the user record in the "User" table if it doesn't already exist.
  const { data: userRecord } = await supabase
    .from("users")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  console.log("User Record : ", userRecord)

  if (!userRecord) {
    // Use the part before "@" as a fallback for username.
    const username = user.email?.split("@")[0] ?? "user";
    const { error: userInsertError } = await supabase.from("users").insert([
      {
        id: user.id,
        username,
        email: user.email,
      },
    ]);
    if (userInsertError) {
      console.error("Error inserting user record:", userInsertError);
    }
  }

  // Check if the user already has an organization membership.
  const { data: orgMembership } = await supabase
    .from("organization_users")
    .select("id, organization_id, role")
    .eq("user_id", user.id)
    .maybeSingle();

  console.log("Organization : ", orgMembership)

  let organizationId: string | undefined;
  let userRole: string | undefined;

  // If no membership, attempt to create / find an org based on email domain
  if (!orgMembership) {
    const domain = user.email?.split("@")[1] ?? "";
    if (!domain) {
      // If for some reason there's no domain, we can't proceed with org logic.
      return response;
    }

    // Check if an organization with that domain exists:
    const { data: existingOrg } = await supabase
      .from("organizations")
      .select("id")
      .eq("domain", domain)
      .maybeSingle();

    if (!existingOrg) {
      // Create a brand new organization for this domain.
      const { data: newOrganization, error: orgError } = await supabase
        .from("organizations")
        .insert({ name: domain, domain })
        .select("id")
        .single();

      if (orgError) {
        console.error("Error creating organization:", orgError);
      }

      if (newOrganization) {
        organizationId = newOrganization.id;
        userRole = "ADMIN"; // The user who creates a brand new org is ADMIN.
      }
    } else {
      // If org already exists, user is a MEMBER.
      organizationId = existingOrg.id;
      userRole = "MEMBER";
    }

    // Insert into OrganizationUser if we found/created an org.
    if (organizationId) {
      const { error: membershipError } = await supabase.from("organization_users").insert([
        {
          organization_id: organizationId,
          user_id: user.id,
          role: userRole,
        },
      ]);
      if (membershipError) {
        console.error("Error inserting organization membership:", membershipError);
      }
    }
  } else {
    // Existing membership
    organizationId = orgMembership.organization_id;
    userRole = orgMembership.role;
  }

  // Ensure that org has a "General" channel; add the user to it.
  if (organizationId) {
    // Check if "General" channel exists
    let { data: generalChannel } = await supabase
      .from("conversations")
      .select("id")
      .eq("organization_id", organizationId)
      .eq("type", "CHANNEL")
      .eq("title", "General")
      .maybeSingle();

    console.log("Conversations : ", generalChannel)

    // Create "General" if missing
    if (!generalChannel) {
      const { data: newGeneralChannel, error: gcError } = await supabase
        .from("conversations")
        .insert({
          organization_id: organizationId,
          type: "CHANNEL",
          title: "General",
        })
        .select("id")
        .single();

      if (gcError) {
        console.error("Error creating General channel:", gcError);
      }
      generalChannel = newGeneralChannel;
    }

    // Add current user to General channel
    if (generalChannel) {
      await supabase.from("conversation_participants").insert({
        conversation_id: generalChannel.id,
        user_id: user.id,
        role: userRole === "ADMIN" ? "ADMIN" : "MEMBER",
      });
    }

    // Now handle "PRIVATE" chats
    if (userRole === "ADMIN") {
      // For an admin, check if they already have a 'Self Chat' private conversation
      const { data: existingSelfChat, error: selfChatFetchError } = await supabase
        .from("conversations")
        .select("id")
        .eq("organization_id", organizationId)
        .eq("type", "PRIVATE")
        .eq("title", "Self Chat")
        .maybeSingle();

      if (selfChatFetchError) {
        console.error("Error fetching self chat:", selfChatFetchError);
      }

      if (!existingSelfChat) {
        // Create a self-chat if it doesn't exist
        const { data: newSelfChat, error: selfChatError } = await supabase
          .from("conversations")
          .insert({
            organization_id: organizationId,
            type: "PRIVATE",
            title: "Self Chat",
          })
          .select("id")
          .single();

        if (selfChatError) {
          console.error("Error creating self chat conversation:", selfChatError);
        } else if (newSelfChat) {
          await supabase.from("conversation_participants").insert({
            conversation_id: newSelfChat.id,
            user_id: user.id,
            role: "ADMIN",
          });
        }
      }
    } else if (userRole === "MEMBER") {
      // For a member, create exactly one private conversation with an Admin (only if none exists).
      // 1) Find an admin in the same organization
      const { data: adminData, error: adminFetchError } = await supabase
        .from("organization_users")
        .select("user_id")
        .eq("organization_id", organizationId)
        .eq("role", "ADMIN")
        .maybeSingle();

      console.log("Admin : ", adminData)

      if (adminFetchError) {
        console.error("Error fetching admin membership:", adminFetchError);
      } else if (adminData?.user_id) {
        // 2) Check all private conversations in this org to see if there's one that includes both:
        //    - the current member, and
        //    - that admin user
        const { data: privateConversations, error: pcError } = await supabase
          .from("conversations")
          .select(
            `
              id,
              type,
              organization_id,
              conversation_participants (
                user_id
              )
            `
          )
          .eq("type", "PRIVATE")
          .eq("organization_id", organizationId);

        console.log("Private converation : ", privateConversations)

        if (pcError) {
          console.error("Error fetching private conversations:", pcError);
        } else {
          // 3) See if any conversation has both the current user and the admin user
          const existingConv = (privateConversations ?? []).find((conv) => {
            const participantIds = conv.conversation_participants.map((p) => p.user_id);
            return participantIds.includes(user.id) && participantIds.includes(adminData.user_id);
          });



          // If no existing admin-member chat, create one
          if (!existingConv) {
            const { data: privateConv, error: newPcError } = await supabase
              .from("conversations")
              .insert({
                organization_id: organizationId,
                type: "PRIVATE",
              })
              .select("id")
              .single();

            if (newPcError) {
              console.error("Error creating private conversation:", newPcError);
            } else if (privateConv) {
              const { error: participantError } = await supabase
                .from("conversation_participants")
                .insert([
                  {
                    conversation_id: privateConv.id,
                    user_id: adminData.user_id,
                    role: "ADMIN",
                  },
                  {
                    conversation_id: privateConv.id,
                    user_id: user.id,
                    role: "MEMBER",
                  },
                ]);

              if (participantError) {
                console.error("Error adding participants to private conversation:", participantError);
              }
            }
          }
        }
      }
    }
  }

  // Return the possibly updated response object
  return response;
}
