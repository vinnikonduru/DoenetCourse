// We're able to import and re-use the same code we use in our app
const seed = require('../server/db');
let driveList = [];
let userId = '';
module.exports = (on) => {
  on('task', {
    'seed:db' (data) {
      seed(data);
      return true;
    },
    'setDriveId':(driveId)=>{
      return driveList.push(driveId);
    },
    'getDriveId':()=>{
      return driveList;
    },
    'setUserId':(userId)=>{
      return userId = userId;
    },
    'getUserId':()=>{
      return userId;
    }
  })
}