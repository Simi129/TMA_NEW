import React, { useState, useEffect, useCallback } from 'react';
import { Typography, List, ListItem, ListItemIcon, ListItemText, Button, Modal, Box } from '@mui/material';
import { Star, Wallet, Telegram, Group, Twitter } from '@mui/icons-material';
import { useTonConnectUI } from '@tonconnect/ui-react';
import DailyRewardCalendar from './DailyRewardCalendar';
import styles from './QuestsScreen.module.css';
import '../../../types'; // Убедитесь, что путь к файлу types.ts правильный
import { useCoins } from '../../../contexts/CoinContext';

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
    const channelUsername = 'lastrunmanage'; // Замените на username вашего канала
    const channelUrl = `https://t.me/${channelUsername}`;

    const tg = window.Telegram?.WebApp;
    
    if (tg && typeof tg.openLink === 'function') {
      tg.openLink(channelUrl);
    } else {
      window.open(channelUrl, '_blank');
    }

    setIsCheckingSubscription(true);
  }, []);

  const checkSubscription = useCallback(() => {
    // Здесь должен быть запрос к вашему API для проверки подписки пользователя
    setTimeout(() => {
      setQuests(prevQuests => 
        prevQuests.map(quest => 
          quest.id === 3 ? { ...quest, completed: true } : quest
        )
      );
      
      addCoins(150); // 150 монет за подписку на канал
      
      const tg = window.Telegram?.WebApp;
      if (tg && typeof tg.showAlert === 'function') {
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
    // Проверяем подключение сразу после открытия модального окна
    if (tonConnectUI.connected) {
      setQuests(prevQuests => 
        prevQuests.map(quest => 
          quest.id === 2 ? { ...quest, completed: true } : quest
        )
      );
      addCoins(200); // 200 монет за подключение кошелька
      const tg = window.Telegram?.WebApp;
      if (tg && typeof tg.showAlert === 'function') {
        tg.showAlert('Кошелек успешно подключен! Вы получили 200 монет.');
      } else {
        alert('Кошелек успешно подключен! Вы получили 200 монет.');
      }
    }
  } catch (error) {
    console.error('Ошибка при подключении кошелька:', error);
    // Здесь можно добавить обработку ошибки, например, показать пользователю сообщение
  }
}, [tonConnectUI, addCoins]);

  useEffect(() => {
    if (isCheckingSubscription) {
      const intervalId = setInterval(() => {
        checkSubscription();
      }, 5000); // Проверяем каждые 5 секунд
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