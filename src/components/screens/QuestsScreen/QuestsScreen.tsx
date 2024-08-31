import React, { useState, useEffect, useCallback } from 'react';
import { Typography, List, ListItem, ListItemIcon, ListItemText, Button, Modal, Box } from '@mui/material';
import { Star, Wallet, Telegram, Group, Twitter } from '@mui/icons-material';
import { useTonConnectUI } from '@tonconnect/ui-react';
import DailyRewardCalendar from './DailyRewardCalendar';
import styles from './QuestsScreen.module.css';
import { useCoins } from '../../../contexts/CoinContext';

// Удалите локальное определение TelegramWebApp и глобальное объявление Window

interface Quest {
  id: number;
  icon: React.ReactNode;
  title: string;
  reward: number;
  action: () => void;
  completed: boolean;
}

const QuestsScreen: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(false);
  const { addCoins } = useCoins();
  const [tonConnectUI] = useTonConnectUI();

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleTelegramSubscription = useCallback(() => {
    const channelUsername = 'lastrunmanage';
    const channelUrl = `https://t.me/${channelUsername}`;

    const tg = window.Telegram?.WebApp;
    
    if (tg && 'openLink' in tg) {
      tg.openLink(channelUrl);
    } else {
      window.open(channelUrl, '_blank');
    }

    setIsCheckingSubscription(true);
  }, []);

  const checkSubscription = useCallback(() => {
    setTimeout(() => {
      setQuests(prevQuests => 
        prevQuests.map(quest => 
          quest.id === 3 ? { ...quest, completed: true } : quest
        )
      );
      
      addCoins(150);
      
      const tg = window.Telegram?.WebApp;
      if (tg && 'showAlert' in tg) {
        tg.showAlert('Вы успешно подписались на канал и получили 150 монет!');
      } else {
        alert('Вы успешно подписались на канал и получили 150 монет!');
      }
      
      setIsCheckingSubscription(false);
    }, 2000);
  }, [addCoins]);

  const handleWalletConnection = useCallback(async () => {
    try {
      await tonConnectUI.openModal();
      if (tonConnectUI.connected) {
        setQuests(prevQuests => 
          prevQuests.map(quest => 
            quest.id === 2 ? { ...quest, completed: true } : quest
          )
        );
        addCoins(200);
        const tg = window.Telegram?.WebApp;
        console.log('TonConnect status:', tonConnectUI.connected);
        console.log('Telegram WebApp available:', !!tg);
        if (tg && 'showAlert' in tg) {
          setTimeout(() => {
            tg.showAlert('Вы успешно подключили свой TON кошелёк и получили 200 монет!');
          }, 100);
        } else {
          alert('Кошелек успешно подключен! Вы получили 200 монет.');
        }
      }
    } catch (error) {
      console.error('Ошибка при подключении кошелька:', error);
      const tg = window.Telegram?.WebApp;
      if (tg && 'showAlert' in tg) {
        tg.showAlert('Ошибка при подключении кошелька. Попробуйте ещё раз.');
      } else {
        alert('Ошибка при подключении кошелька. Попробуйте ещё раз.');
      }
    }
  }, [tonConnectUI, addCoins]);

  useEffect(() => {
    if (isCheckingSubscription) {
      const intervalId = setInterval(() => {
        checkSubscription();
      }, 5000);
      return () => clearInterval(intervalId);
    }
  }, [isCheckingSubscription, checkSubscription]);

  useEffect(() => {
    setQuests([
      { 
        id: 1, 
        icon: <Star />, 
        title: "Получение ежедневной награды", 
        reward: 100, 
        action: handleOpenModal,
        completed: false
      },
      { 
        id: 2, 
        icon: <Wallet />, 
        title: "Подключить кошелёк", 
        reward: 200, 
        action: handleWalletConnection,
        completed: tonConnectUI.connected
      },
      { 
        id: 3, 
        icon: <Telegram />, 
        title: "Подписаться на официальный канал телеграм", 
        reward: 150, 
        action: handleTelegramSubscription,
        completed: false
      },
      { 
        id: 4, 
        icon: <Group />, 
        title: "Пригласить 5 друзей", 
        reward: 300, 
        action: () => console.log("Приглашение друзей"),
        completed: false
      },
      { 
        id: 5, 
        icon: <Twitter />, 
        title: "Подписаться на официальный аккаунт X", 
        reward: 150, 
        action: () => console.log("Подписка на X"),
        completed: false
      },
    ]);
  }, [handleOpenModal, handleTelegramSubscription, handleWalletConnection, tonConnectUI.connected]);

  return (
    <div className={styles.questsContainer}>
      <Typography variant="h4" className={styles.title}>Квесты</Typography>
      <List>
        {quests.map((quest) => (
          <ListItem key={quest.id} className={styles.questItem}>
            <ListItemIcon className={styles.questIcon}>{quest.icon}</ListItemIcon>
            <ListItemText 
              primary={quest.title}
              secondary={`Награда: ${quest.reward} монет`}
              className={styles.questText}
            />
            <Button 
              variant="contained" 
              onClick={quest.action}
              className={styles.startButton}
              disabled={quest.completed}
            >
              {quest.completed ? 'Выполнено' : 'Начать'}
            </Button>
          </ListItem>
        ))}
      </List>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="daily-reward-modal"
        aria-describedby="daily-reward-calendar"
      >
        <Box className={styles.modalContent}>
          <DailyRewardCalendar />
          <Button onClick={handleCloseModal} className={styles.closeButton}>
            Закрыть
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default QuestsScreen;