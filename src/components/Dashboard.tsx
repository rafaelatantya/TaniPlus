import { useCallback } from '@lynx-js/react';
import './Dashboard.css';

interface DashboardProps {
  onNavigate: (page: 'login' | 'register' | 'dashboard') => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const handleLogout = useCallback(() => {
    onNavigate('login');
  }, [onNavigate]);

  const mockBoxes = [
    { id: 1, name: 'Box 1 - Kebun Tomat', status: 'Bagus', details: 'Kelembapan tanah optimal (78%)' },
    { id: 2, name: 'Box 2 - Green House A', status: 'Butuh Perawatan', details: 'Suhu terlalu tinggi (34°C)' },
    { id: 3, name: 'Box 3 - Sawah Barat', status: 'Bagus', details: 'Kelembapan tanah optimal (75%)' },
    { id: 4, name: 'Box 4 - Kebun Cabai', status: 'Bagus', details: 'Kadar air cukup' },
    { id: 5, name: 'Box 5 - Hydroponic B', status: 'Bagus', details: 'Nutrisi level tercukupi' },
    { id: 6, name: 'Box 6 - Sawah Timur', status: 'Bagus', details: 'Kelembapan tanah optimal (77%)' },
  ];

  return (
    <view className="DashboardScreen">
      <view className="DashboardHeader">
        <text className="WelcomeText">Halo Petani</text>
        <view className="LogoutBtn" bindtap={handleLogout}>
          <text className="LogoutText">Logout</text>
        </view>
      </view>

      <view className="RecommendationBanner">
        <view className="IconWrapper">
          <view className="LightBulbIcon">
            <view className="BulbCircle" />
            <view className="BulbBase" />
          </view>
        </view>
        <view className="BannerTextContainer">
          <text className="BannerTitle">Rekomendasi Pintar</text>
          <text className="BannerBody">Box 2 perlu diperhatikan!!</text>
        </view>
      </view>

      <view className="StatsGrid">
        <view className="StatsRow">
          <view className="StatCard CardGreen">
            <view className="StatIconContainer">
              <view className="CheckIcon">
                <view className="CheckLine1" />
                <view className="CheckLine2" />
              </view>
            </view>
            <view className="StatTextContainer">
              <text className="StatNumber ColorGreenText">4</text>
              <text className="StatLabel ColorGreenText">Wilayah Bagus</text>
            </view>
          </view>

          <view className="StatCard CardOrange">
            <view className="StatIconContainer">
              <view className="TriangleIcon">
                <view className="TriangleExclamation" />
              </view>
            </view>
            <view className="StatTextContainer">
              <text className="StatNumber ColorOrangeText">0</text>
              <text className="StatLabel ColorOrangeText">Butuh Perawatan</text>
            </view>
          </view>
        </view>

        <view className="StatCardFull CardBlue">
          <view className="StatIconContainer">
            <view className="RssIcon">
              <view className="RssDot" />
              <view className="RssRing1" />
              <view className="RssRing2" />
            </view>
          </view>
          <view className="StatTextContainer">
            <text className="StatNumber ColorBlueText">6</text>
            <text className="StatLabel ColorBlueText">Box Aktif</text>
          </view>
        </view>
      </view>

      <view className="SectionTitleContainer">
        <text className="SectionTitle">Daftar Box</text>
      </view>

      <scroll-view className="BoxListContainer" scroll-y={true}>
        {mockBoxes.map((box) => (
          <view key={box.id} className="BoxItemCard">
            <view className="BoxItemHeader">
              <text className="BoxItemName">{box.name}</text>
              <view className={`BoxStatusTag ${box.status === 'Bagus' ? 'TagGreen' : 'TagOrange'}`}>
                <text className={`BoxStatusText ${box.status === 'Bagus' ? 'TextGreen' : 'TextOrange'}`}>
                  {box.status}
                </text>
              </view>
            </view>
            <text className="BoxItemDetails">{box.details}</text>
          </view>
        ))}
      </scroll-view>
    </view>
  );
}
