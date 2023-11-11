class ScoreHistory {
    constructor(score, namePlayer) {
        this.score = score;
        this.namePlayer = namePlayer;
        this.date = Date.now();
    }

    saveScore() {
        console.log("Saving score...");
       let db = new Database("scores",{score: this.score, nameUser: this.namePlayer, date: this.date});
       console.log("db",db)
        db.putItem();

    }
    async getScore()  {
        let db = new Database("scores");
       return db.getItems();
    }

}