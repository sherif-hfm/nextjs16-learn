import UserInfo from "@/components/userInfo";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession(authOptions);
  
  // Debug: uncomment to check session in server logs
  // console.log("Session:", session);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col gap-2 items-center">
          <p className="text-lg">You are not logged in.</p>
          <div className="flex flex-col gap-2">
            <Link href="/login">Login</Link> 
            <Link href="/profile">Profile</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <UserInfo />
  );
}
