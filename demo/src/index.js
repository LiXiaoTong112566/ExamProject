import dva from 'dva';
 import createLoading from "dva-loading";  
import './index.css';

const app = dva();
app.use(createLoading())

app.model(require('./models/login.module').default);
app.model(require('./models/questionClass.module').default);
app.model(require('./models/userManage.module').default);
app.model(require("./models/addUser/userAllData.module").default)
app.model(require('./models/GradeManage.module').default);
app.model(require('./models/ClassManage.module').default);
app.model(require('./models/ExamList.module').default);
app.model(require('./models/global').default);
app.model(require('./models/lookCheck.module').default);
app.model(require('./models/manageStudent.model').default);
app.model(require('./models/AwaitClass.module').default);
// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');
