import { useCallback } from '@lynx-js/react';
import iconPlantGreen from '../icon_plant_green.svg';
import iconPlantOrange from '../icon_plant_orange.svg';
import iconPlantGrey from '../icon_plant_grey.svg';
import iconPlantBlue from '../icon_plant_blue.svg';

import iconWaterBlue from '../icon_water_blue.svg';
import iconWaterOrange from '../icon_water_orange.svg';
import iconWaterGrey from '../icon_water_grey.svg';

import iconTempGreen from '../icon_temp_green.svg';
import iconTempOrange from '../icon_temp_orange.svg';
import iconTempGrey from '../icon_temp_grey.svg';

import iconCheckWhite from '../icon_check_white.svg';
import iconDanger from '../icon_danger.svg';
import iconRss from '../icon_rss.svg';
import './Dashboard.css';

interface DashboardProps {
  onNavigate: (page: 'login' | 'register' | 'dashboard' | 'details', data?: any) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const handleLogout = useCallback(() => {
    onNavigate('login');
  }, [onNavigate]);

  const mockBoxes = [
    { id: 1, name: 'Box 1 - Lahan Tomat', status: 'Perlu Perawatan', water: '65%', sprout: '50%', temp: '29°C' },
    { id: 2, name: 'Box 2 - Lahan Cabai', status: 'Perlu Perawatan', water: '65%', sprout: '50%', temp: '29°C' },
    { id: 3, name: 'Box 3 - Lahan Bawang', status: 'Bagus', water: '65%', sprout: '50%', temp: '29°C' },
    { id: 4, name: 'Box 4 - Lahan Kentang', status: 'Bagus', water: '65%', sprout: '50%', temp: '29°C' },
    { id: 5, name: 'Box 5 - Lahan Melon', status: 'Error', water: 'Error', sprout: 'Error', temp: 'Error' },
  ];

  return (
    <view className="DashboardScreen">
      <view className="DashboardHeader">
        <view className="HeaderWelcomeArea">
          <view className="WelcomeAvatar" />
          <text className="WelcomeText">Halo Petani</text>
        </view>
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
            <view className="StatIconContainer StatIconContainerGreen">
              <image src={iconCheckWhite} className="StatCardIcon" />
            </view>
            <view className="StatTextContainer">
              <text className="StatNumber ColorGreenText">2</text>
              <text className="StatLabel ColorGreenText">Wilayah Bagus</text>
            </view>
          </view>

          <view className="StatCard CardOrange">
            <view className="StatIconContainer StatIconContainerOrange">
              <image src={iconDanger} className="StatCardIcon" />
            </view>
            <view className="StatTextContainer">
              <text className="StatNumber ColorOrangeText">2</text>
              <text className="StatLabel ColorOrangeText">Butuh Perawatan</text>
            </view>
          </view>
        </view>

        <view className="StatCardFull CardGrey">
          <view className="StatIconContainer StatIconContainerGrey">
            <image src={iconRss} className="StatCardIcon" />
          </view>
          <view className="StatTextContainer">
            <text className="StatNumber ColorGreyText">1</text>
            <text className="StatLabel ColorGreyText">Box Error</text>
          </view>
        </view>
      </view>

      <view className="SectionTitleContainer">
        <text className="SectionTitle">Daftar Box</text>
      </view>

      <scroll-view className="BoxListContainer" scroll-y={true}>
        {mockBoxes.map((box) => {
          // Determine status suffix for class names
          const statusClass = box.status.replace(/\s+/g, '');

          // Determine icons based on status
          let plantIcon = iconPlantGreen;
          let waterIcon = iconWaterBlue;
          let sproutIcon = iconPlantBlue;
          let tempIcon = iconTempGreen;

          if (box.status === 'Perlu Perawatan') {
            plantIcon = iconPlantOrange;
            waterIcon = iconWaterOrange;
            sproutIcon = iconPlantOrange;
            tempIcon = iconTempOrange;
          } else if (box.status === 'Error') {
            plantIcon = iconPlantGrey;
            waterIcon = iconWaterGrey;
            sproutIcon = iconPlantGrey;
            tempIcon = iconTempGrey;
          }

          return (
            <view key={box.id} className={`BoxItemCard Card${statusClass}`} bindtap={() => onNavigate('details', box)}>
              <view className="BoxItemHeader">
                <view className="BoxItemInfo">
                  <view className={`BoxItemPlantIconContainer PlantBg${statusClass}`}>
                    <image src={plantIcon} className="BoxItemPlantIcon" />
                  </view>
                  <view className="BoxNameAndStatus">
                    <text className={`BoxItemName TextName${statusClass}`}>{box.name}</text>
                    <view className={`BoxStatusTag Tag${statusClass}`}>
                      <view className={`BoxStatusDot Dot${statusClass}`} />
                      <text className={`BoxStatusText Text${statusClass}`}>
                        {box.status}
                      </text>
                    </view>
                  </view>
                </view>
                <view className="ArrowIcon">
                  <view className={`ArrowLine1 ArrowLine${statusClass}`} />
                  <view className={`ArrowLine2 ArrowLine${statusClass}`} />
                </view>
              </view>

              <view className="BoxSensorsRow">
                <view className="SensorCol">
                  <view className="SensorIconContainer WaterBg">
                    <image src={waterIcon} className="SensorIcon" />
                  </view>
                  <text className={`SensorValue SensorValue${statusClass}`}>{box.water}</text>
                </view>
                <view className="SensorCol">
                  <view className="SensorIconContainer SproutBg">
                    <image src={sproutIcon} className="SensorIcon" />
                  </view>
                  <text className={`SensorValue SensorValue${statusClass}`}>{box.sprout}</text>
                </view>
                <view className="SensorCol">
                  <view className="SensorIconContainer TempBg">
                    <image src={tempIcon} className="SensorIcon" />
                  </view>
                  <text className={`SensorValue SensorValue${statusClass}`}>{box.temp}</text>
                </view>
              </view>
            </view>
          );
        })}
      </scroll-view>
    </view>
  );
}

interface BoxDetailsProps {
  box: any;
  onBack: () => void;
}

export function BoxDetails({ box, onBack }: BoxDetailsProps) {
  const isBuruk = box.status === 'Perlu Perawatan' || box.status === 'Error';

  const metrics = [
    { id: 1, label: 'Kandungan Air', value: box.water, status: isBuruk ? 'Buruk' : 'Baik' },
    { id: 2, label: 'Kelembapan Tanah', value: box.sprout, status: isBuruk ? 'Buruk' : 'Baik' },
    { id: 3, label: 'Suhu Udara', value: box.temp, status: isBuruk ? 'Buruk' : 'Baik' },
    { id: 4, label: 'Curah Hujan', value: '22 mm', status: isBuruk ? 'Sedang' : 'Baik' },
    { id: 5, label: 'Umur Tanaman', value: '30 hst', status: isBuruk ? 'Sedang' : 'Baik' },
  ];

  return (
    <view className={`DetailsScreen ${isBuruk ? 'DetailsScreenBuruk' : 'DetailsScreenBaik'}`}>
      <view className="DetailsHeader">
        <view className="BackButton" bindtap={onBack}>
          <view className="BackArrowLine1" />
          <view className="BackArrowLine2" />
        </view>
        <text className="DetailsHeaderTitle">{box.name}</text>
        <view className="HeaderSpacer" />
      </view>

      <view className="DetailsHeroSection">
        <text className={`DetailsStatusTitle ${isBuruk ? 'TextBuruk' : 'TextBaik'}`}>
          {isBuruk ? 'Wilayah Buruk' : 'Wilayah Baik'}
        </text>
        <text className="DetailsStatusDesc">
          {isBuruk ? 'Kondisi tanaman dan tanah tidak bagus' : 'Kondisi tanaman dan tanah bagus'}
        </text>
      </view>

      <view className="MetricsList">
        {metrics.map((metric) => (
          <view key={metric.id} className="MetricRowCard">
            <view className="MetricLabelContainer">
              <text className="MetricRowLabel">{metric.label}</text>
            </view>
            <view className="MetricValueContainer">
              <text className="MetricRowValue">{metric.value}</text>
              <view className={`MetricRowTag ${metric.status === 'Baik' ? 'TagGreen' : metric.status === 'Sedang' ? 'TagOrange' : 'TagRed'}`}>
                <text className={`MetricRowTagText ${metric.status === 'Baik' ? 'TextGreen' : metric.status === 'Sedang' ? 'TextOrange' : 'TextRed'}`}>
                  {metric.status}
                </text>
              </view>
            </view>
          </view>
        ))}
      </view>

      <view className="DeviceInfoSection">
        <text className="DeviceSectionTitle">Informasi Perangkat</text>
        <view className="DeviceCard">
          <view className="DeviceDetailRow">
            <text className="DeviceDetailLabel">ID Perangkat</text>
            <text className="DeviceDetailValue">{box.status === 'Bagus' ? 'HT-001' : 'HT-002'}</text>
          </view>
          <view className="DeviceDetailRow">
            <text className="DeviceDetailLabel">Sinkronisasi Terakhir</text>
            <text className="DeviceDetailValue">2 menit lalu</text>
          </view>
          <view className="DeviceDetailRow">
            <text className="DeviceDetailLabel">Baterai</text>
            <text className="DeviceDetailValue">85%</text>
          </view>
        </view>
      </view>
    </view>
  );
}
