const connection = require('../entity/connection.js')
class TopicService{
    connect;
    constructor(){
        connection.connectToMySQL();
        this.connect = connection.getConnection()
    }

    findAllTopic= () =>{
        return new Promise((resolve, reject)=>{
            this.connect.query('select * from topic',(err,topics)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(topics)
                }
            })
        })
    }
}
module.exports = new TopicService()