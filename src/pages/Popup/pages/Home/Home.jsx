import React, { useState } from 'react';
import './Home.css';
import { useGlobalState } from '../../../../lib/state/GlobalStateProvider';
import { useAuth } from '../../../../lib/auth/AuthContextProvider';
import Button from '../../../../components/common/basics/button';
import { getAssetUrl } from '../../helpers/getasseturl';
import CreatorCard from '../../../../components/common/CreatorCard';
import MetricItem from '../../../../components/common/MetricItem';
import Divider from '../../../../components/common/Divider';
import CreateCreator from '../Onboard/CreateCreator';
import { Wordmark } from '../../../../components/common/logos';

const Home = () => {

  const { currentCreator, currentCreatorPlatform, selectedBusiness } = useGlobalState();
  const { logout } = useAuth();
  const [showCreateCreator, setShowCreateCreator] = useState(false);

  const handleLogout = () => {
    logout();
    // The AuthContextProvider should handle redirecting to the login page
  };

  if (showCreateCreator) {
    return <CreateCreator onBack={() => setShowCreateCreator(false)} />;
  }



  return (
    <div className="home-container">
      <div className="header">
      <div className="wordmark-container">
          <Wordmark />
        </div>
        <Button onClick={handleLogout} className="logout-button">Logout</Button>
      </div>
      
      <CreatorCard 
        creator={{
          name: currentCreator,
          handle: currentCreator,
          image: "https://scontent-sjc3-1.cdninstagram.com/v/t51.2885-19/461774482_1264421441231551_3834671700131713807_n.jpg?stp=dst-jpg_s150x150&_nc_ht=scontent-sjc3-1.cdninstagram.com&_nc_cat=1&_nc_ohc=oR_Te4tWmjcQ7kNvgHsPP_v&_nc_gid=548b70e104c542968bf413d4d0dce2d5&edm=APoiHPcBAAAA&ccb=7-5&oh=00_AYD-LtSAzQ9T-mMhTLkUFssBf6XC1vc4hMwpHDbZy_9DDw&oe=67150739&_nc_sid=22de04",
        }}
        onSave={() => setShowCreateCreator(true)}
      />
      
      <Divider />
      
      <div className="metrics-grid">
        <MetricItem icon="👥" value="8.6k" label="Followers" />
        <MetricItem icon="📈" value="888" label="Followers 30 Days" growth={11} />
        <MetricItem icon="👁️" value="1.3m" label="Total views" />
        <MetricItem icon="📊" value="156k" label="Views 30 Days" growth={10.8} />
        <MetricItem icon="🔄" value="7.8%" label="Avg. Engagement rate" />
        <MetricItem icon="📊" value="11%" label="Engagement 30 Days" growth={5} />
        <MetricItem icon="💬" value="25" label="Avg. Comments" />
        <MetricItem icon="❤️" value="88" label="Avg. Likes" />
      </div>

    
    </div>
  );
};

export default Home;