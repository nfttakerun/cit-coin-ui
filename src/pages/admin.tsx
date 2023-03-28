import {
  Alert, Box, Flex,
  Heading, Icon, Spinner,
  Tab,
  TabList, TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import useTranslation from 'next-translate/useTranslation';
import { useAccount, useContract, useContractRead, useNetwork } from 'wagmi';
import { QuestionManager, Settings } from '@/components/admin';
import { defaultChain, getContractAddress } from '@/utils/contract';
import { FaFile, FaUsers, FaChartBar } from 'react-icons/fa';
import { SettingsIcon } from '@chakra-ui/icons';
import { useEffect, useState } from 'react';
import LearnToEarnABI from '@/utils/abis/LearnToEarn.json';

const Admin = () => {
  const { t } = useTranslation('admin');
  const { address, connector, isConnected } = useAccount();
  const { chain } = useNetwork();

  const LearnToEarnAddress = getContractAddress('LearnToEarn');
  const {
    data: contractData,
    error: contractError,
    isLoading, isIdle,
  } = useContractRead({
    address: LearnToEarnAddress,
    abi: LearnToEarnABI,
    functionName: 'admin',
    chainId: chain?.id,
  });

  const adminComponents = [
    {
      title: t('tab.SET_QUESTIONS'),
      icon: FaFile,
      component: <QuestionManager />,
    },
    {
      title: t('tab.MANAGE_STUDENTS'),
      icon: FaUsers,
      component: <Heading>Manage Students</Heading>,
    },
    {
      title: t('tab.STATISTICS'),
      icon: FaChartBar,
      component: <Heading>Statistics</Heading>,
    },
    {
      title: t('tab.SETTINGS'),
      icon: SettingsIcon,
      component: <Settings/>,
    },
  ];


  return (
    <>
      {isLoading && <Flex alignItems={'center'} justifyContent={'center'}>
        <Spinner />
      </Flex>}
      {address !==contractData && (<Alert variant={'subtle'} status={'error'}>
        {t('NO_PERMISSION')}
      </Alert>)}
      {isConnected && chain?.id === defaultChain.id && address===contractData &&
        <Tabs isLazy={true} orientation={'vertical'} variant={'unstyled'} colorScheme={'blue'} minHeight={'90vh'}>
          <TabList width={300} minWidth={300} bg={'#cdf2'} borderRight={"solid #cdf8"}>
            {adminComponents.map(({ title, icon }, idx) => (
              <Tab fontSize={'md'} key={idx} justifyContent={'flex-start'}
                   _selected={{ color: 'blue.500', fontWeight: 'bold' }}>
                <Icon as={icon} mr={3} boxSize={5} />
                {title}
              </Tab>))}
          </TabList>
          <TabPanels>
            {adminComponents.map(({ component }, idx) => <TabPanel key={idx}>{component}</TabPanel>)}
          </TabPanels>
        </Tabs>}
    </>

  );
};
export default Admin;