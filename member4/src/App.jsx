   import { useState } from "react";
   import AdminPanel from "./Adminpanel.jsx";
   import CommunityForm from "./Communityform.jsx";

   export default function App() {
     const [page, setPage] = useState("admin");
     return (
       <>
         <div style={{ padding: 10 }}>
           <button onClick={() => setPage("admin")}>Admin Panel</button>{" "}
           <button onClick={() => setPage("form")}>Community Form</button>
         </div>
         {page === "admin" ? <AdminPanel /> : <CommunityForm />}
       </>
     );
   }