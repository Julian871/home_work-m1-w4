import {app} from "./settings";
import {runDb} from "./db/db";

const port = process.env.PORT || 3002


const startApp = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`Started on ${port} port`)
    })
}

startApp()