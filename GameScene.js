const gameState = {
    score: 0,
    starRating: 5,
    currentWaveCount: 1,
    customerIsReady: false,
    cam: {},
    gameSpeed: 3,
    currentMusic: {},
    totalWaveCount: 3,
    countdownTimer: 1500
  }
  
  // Gameplay scene
  class GameScene extends Phaser.Scene {
    constructor() {
      super({ key: 'GameScene' })
    }
  
    preload() {
      // Preload images
      const baseURL = 'https://content.codecademy.com/courses/learn-phaser/fastfoodie/';
      this.load.image('Chef', `${baseURL}art/Chef.png`);
      this.load.image('Customer-1', `${baseURL}art/Customer-1.png`);
      this.load.image('Customer-2', `${baseURL}art/Customer-2.png`);
      this.load.image('Customer-3', `${baseURL}art/Customer-3.png`);
      this.load.image('Customer-4', `${baseURL}art/Customer-4.png`);
      this.load.image('Customer-5', `${baseURL}art/Customer-5.png`);
      this.load.image('Floor-Server', `${baseURL}art/Floor-Server.png`);
      this.load.image('Floor-Customer', `${baseURL}art/Floor-Customer.png`);
      this.load.image('Tray', `${baseURL}art/Tray.png`);
      this.load.image('Barrier', `${baseURL}art/Barrier.png`);
      this.load.image('Star-full', `${baseURL}art/Star-full.png`);
      this.load.image('Star-half', `${baseURL}art/Star-half.png`);
      this.load.image('Star-empty', `${baseURL}art/Star-empty.png`);
  
      // Preload song
      this.load.audio('gameplayTheme', [
        `${baseURL}audio/music/2-gameplayTheme.ogg`,
        `${baseURL}audio/music/2-gameplayTheme.mp3`
      ]); // Credit: "Pixel Song #18" by hmmm101: https://freesound.org/people/hmmm101
  
      // Preload SFX
      this.load.audio('placeFoodSFX', [
        `${baseURL}audio/sfx/placeFood.ogg`,
        `${baseURL}audio/sfx/placeFood.mp3`
      ]); // Credit: "action_02.wav" by dermotte: https://freesound.org/people/dermotte
  
      this.load.audio('servingCorrectSFX', [
        `${baseURL}audio/sfx/servingCorrect.ogg`,
        `${baseURL}audio/sfx/servingCorrect.mp3`
      ]); // Credit: "Video Game SFX Positive Action Long Tail" by rhodesmas: https://freesound.org/people/djlprojects
  
      this.load.audio('servingIncorrectSFX', [
        `${baseURL}audio/sfx/servingIncorrect.ogg`,
        `${baseURL}audio/sfx/servingIncorrect.mp3`
      ]); // Credit: "Incorrect 01" by rhodesmas: https://freesound.org/people/rhodesmas
  
      this.load.audio('servingEmptySFX', [
        `${baseURL}audio/sfx/servingEmpty.ogg`,
        `${baseURL}audio/sfx/servingEmpty.mp3`
      ]); // Credit: "Computer Error Noise [variants of KevinVG207's Freesound#331912].wav" by Timbre: https://freesound.org/people/Timbre
  
      this.load.audio('fiveStarsSFX', [
        `${baseURL}audio/sfx/fiveStars.ogg`,
        `${baseURL}audio/sfx/fiveStars.mp3`
      ]); // Credit: "Success 01" by rhodesmas: https://freesound.org/people/rhodesmas
  
      this.load.audio('nextWaveSFX', [
        `${baseURL}audio/sfx/nextWave.ogg`,
        `${baseURL}audio/sfx/nextWave.mp3`
      ]); // Credit: "old fashion radio jingle 2.wav" by rhodesmas: https://freesound.org/people/chimerical
    }
  
    create() {
      // Stop, reassign, and play the new music
      gameState.currentMusic.stop();
      gameState.currentMusic = this.sound.add('gameplayTheme');
      gameState.currentMusic.play({ loop: true });
  
      // Assign SFX
      gameState.sfx = {};
      gameState.sfx.placeFood = this.sound.add('placeFoodSFX');
      gameState.sfx.servingCorrect = this.sound.add('servingCorrectSFX');
      gameState.sfx.servingIncorrect = this.sound.add('servingIncorrectSFX');
      gameState.sfx.servingEmpty = this.sound.add('servingEmptySFX');
      gameState.sfx.fiveStars = this.sound.add('fiveStarsSFX');
      gameState.sfx.nextWave = this.sound.add('nextWaveSFX');
  
      // Create environment sprites
      gameState.floorServer = this.add.sprite(gameState.cam.midPoint.x, 0, 'Floor-Server').setScale(0.5).setOrigin(0.5, 0);
      gameState.floorCustomer = this.add.sprite(gameState.cam.midPoint.x, gameState.cam.worldView.bottom, 'Floor-Customer').setScale(0.5).setOrigin(0.5, 1);
      gameState.table = this.add.sprite(gameState.cam.midPoint.x, gameState.cam.midPoint.y, 'Barrier').setScale(0.5);
  
      // Create player and tray sprites
      gameState.tray = this.add.sprite(gameState.cam.midPoint.x, gameState.cam.midPoint.y, 'Tray').setScale(0.5);
      gameState.player = this.add.sprite(gameState.cam.midPoint.x, 200, 'Chef').setScale(0.5);
  
      // Display the score
      gameState.scoreTitleText = this.add.text(gameState.cam.midPoint.x, 30, 'Score', { fontSize: '15px', fill: '#666666' }).setOrigin(0.5);
      gameState.scoreText = this.add.text(gameState.cam.midPoint.x, gameState.scoreTitleText.y + gameState.scoreTitleText.height + 20, gameState.score, { fontSize: '30px', fill: '#000000' }).setOrigin(0.5);
  
      // Display the wave count
      gameState.waveTitleText = this.add.text(gameState.cam.worldView.right - 20, 30, 'Wave', { fontSize: '64px', fill: '#666666' }).setOrigin(1, 1).setScale(0.25);
      gameState.waveCountText = this.add.text(gameState.cam.worldView.right - 20, 30, gameState.currentWaveCount + '/' + gameState.totalWaveCount, { fontSize: '120px', fill: '#000000' }).setOrigin(1, 0).setScale(0.25);
  
      // Display number of customers left
      gameState.customerCountText = this.add.text(gameState.cam.worldView.right - 20, 80, `Customers left: ${gameState.customersLeftCount}`, { fontSize: '15px', fill: '#000000' }).setOrigin(1);
      
      // Generate wave group
      gameState.customers = this.add.group();
      this.generateWave();
  
    }
  
    update() {
      
    }
  
    /* WAVES */
    // Generate wave
    generateWave() {
      // Add the total number of customers per wave here:
  
  
      for (let i = 0; i < gameState.totalCustomerCount; i++) {
        // Create your container below and add your customers to it below:
  
  
        // Customer sprite randomizer
        let customerImageKey = Math.ceil(Math.random() * 5);
  
        // Draw customers here!
  
        
        // Fullness meter container
        customerContainer.fullnessMeter = this.add.group();
  
        // Define capacity
        customerContainer.fullnessCapacity = Math.ceil(Math.random() * 5 * gameState.totalWaveCount);
  
        // If capacity is an impossible number, reshuffle it until it isn't
        while (customerContainer.fullnessCapacity === 12 || customerContainer.fullnessCapacity === 14) {
          customerContainer.fullnessCapacity = Math.ceil(Math.random() * 5) * gameState.totalWaveCount;
        }
  
        // Edit the meterWidth
        let meterWidth = 200;
        customerContainer.meterContainer = this.add.container(0, customer.y + (meterWidth / 2));
        
        // Add the customerContainer.meterContainer to customerContainer
  
  
        // Add meter base
        customerContainer.meterBase = this.add.rectangle(-130, customer.y, meterWidth, 33, 0x707070).setOrigin(0);
        customerContainer.meterBase.setStrokeStyle(6, 0x707070);
        customerContainer.meterBase.angle = -90;
        customerContainer.meterContainer.add(customerContainer.meterBase);
  
        // Add timer countdown meter body
        customerContainer.timerMeterBody = this.add.rectangle(customerContainer.meterBase.x + 22, customer.y + 1, meterWidth + 4, 12, 0x3ADB40).setOrigin(0);
        customerContainer.timerMeterBody.angle = -90;
        customerContainer.meterContainer.add(customerContainer.timerMeterBody);
  
        // Create container for individual fullness blocks
        customerContainer.fullnessMeterBlocks = [];
  
        // Create fullness meter blocks
        for (let j = 0; j < 1; j++) {
          customerContainer.fullnessMeterBlocks[j] = this.add.rectangle(customerContainer.meterBase.x, customer.y - (10 * j), 10, 20, 0xDBD53A).setOrigin(0);
          customerContainer.fullnessMeterBlocks[j].setStrokeStyle(2, 0xB9B42E);
          customerContainer.fullnessMeterBlocks[j].angle = -90;
          customerContainer.fullnessMeter.add(customerContainer.fullnessMeterBlocks[j]);
          customerContainer.meterContainer.add(customerContainer.fullnessMeterBlocks[j]);
        }
  
        // Hide meters
        customerContainer.meterContainer.visible = false;
      }
    }
  }