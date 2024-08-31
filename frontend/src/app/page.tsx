import Image from "next/image";
import Nav from "./components/Nav/Nav";
import Createmarket from "./components/CreateMarket/Createmarket";
import GetmarketList from "./components/MarketList/GetmarketList";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import TokenApprove from "./components/TokenApprove/TokenApprove";
import Tabs from "./components/Tabs/Tabs";
import Leadership from "./components/Leadership/Leadership";

export default function Home() {
  return (
    <>
      <Nav/>
      <Createmarket />
      {/* <Tabs/> */}
      <GetmarketList />
      <Header />
      <Footer />
      {/* <TokenApprove/> */}
  
    </>
  );
}
