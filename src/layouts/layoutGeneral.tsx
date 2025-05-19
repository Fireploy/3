import {  ReactNode } from "react";
import Footer from "../components/footer";
import Header from "../components/header";

interface Props{
    children: ReactNode
}
function LayoutGeneral({children} : Props) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <div className="md:p-20">
            <div className="">
              {children}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  export default LayoutGeneral;