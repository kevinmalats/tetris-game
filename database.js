
class Database {
  constructor(table, data) {
    this.table = table;
    this.data = data;

  }

    putItem() {
     const db = firebase.firestore();
     console.log("Saving score...",this.table);
      const collection = db.collection(this.table);
     collection.add(this.data)
        .then((docRef) => {
          console.log("Document written with ID: ", docRef.id);
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });

    }
     async getItems() {
        const db = firebase.firestore();
        const collection = db.collection(this.table);
        const data = []
        await collection.get()
            .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log(`${doc.id} => ${doc.data()}`);
              console.log(doc.data());
                data.push(doc.data());
            });
            })
            .catch((error) => {
            console.log("Error getting documents: ", error);
            });
        return data;
    }
}