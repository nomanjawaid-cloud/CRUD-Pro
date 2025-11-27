import Image from "next/image";
import LoginPage from "./auth/LogIn/page";
import UserForm from "./auth/Register/page";
// import CreateUser from "./Users/page";
import DashboardPage from "./Dashboard/page";

function page() {
  return (
    <div>
      <Image
        src="/main-img.png"
        alt="main image"
        width={1200}
        height={600}
        className="w-full h-full object-cover"
      />

      <UserForm />
      <DashboardPage /> 
      <LoginPage />
      {/* <CreateUser /> */}
    </div>
  );
}

export default page;
