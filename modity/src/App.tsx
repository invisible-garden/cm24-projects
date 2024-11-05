import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CodeContent from "@/components/CodeContent";
import { DevTools } from 'jotai-devtools'
import 'jotai-devtools/styles.css'
import ToolsBar from "./components/ToolsBar";
const App: React.FC = () => {
  return (
    <div className="flex flex-col h-screen justify-between bg-background">
      <Header />
      <ToolsBar />
      <div className="overflow-scroll flex-1">
      <div className="m-4 bg-white border">
        <CodeContent />
      </div>

      </div>
      <Footer />
      {/* <DevTools /> */}
    </div>
  );
};

export default App;
