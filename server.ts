import express, { Request, Response } from 'express'
import cors from 'cors'

const PORT = process.env.PORT || 3000

class App {
  public application: express.Application
  constructor() {
    this.application = express()
  }
}

const app = new App().application

app.use(cors())

app.get('/', (req: Request, res: Response) => {
  console.log('///a')
  res.send('server testing ok')
})

app.get('/data/1', (req: Request, res: Response) => {
  res.json({ id: 1, name: 'pepper' })
})

app.listen(PORT, () => console.log(`Example app listening at http://localhost:${PORT}`))