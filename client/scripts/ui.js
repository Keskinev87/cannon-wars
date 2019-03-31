class UI {
    constructor() {
        this.menu = document.getElementById('menu');
        this.gameScene = document.getElementById('game');
        this.gameOver = document.getElementById('game-over');
    }

    showMenu() {
        this.menu.style.display = '';
    }

    hideMenu() {
        this.menu.style.display = 'none';
    }

    showGameScene() {
        this.gameScene.style.display = '';
    }

    hideGameScene() {
        this.gameScene.style.display = 'none';
    }

    showGameOver() {
        this.gameOver.style.display = '';
    }

    hideGameOver() {
        this.gameOver.style.display = '';
    }
}