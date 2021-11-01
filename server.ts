import express, { Request, Response } from 'express'
import cors from 'cors'
const { Client } = require('pg')
const Query = require('pg').Query

const client = new Client({
  user: 'uohjxbyrzzdezi',
  host: 'ec2-67-202-36-228.compute-1.amazonaws.com',
  database: 'd8nokjbf74nhet',
  password: 'f6a7af5ce3488a5369b722ae3d9a5e3b22667a319c1cfd1912466c2212b22fa9',
  port: 5432,
  ssl: {
    rejectUnauthorized: false
  }
})

client.connect((err: any) => {
  if (err) {
    console.error('error ocurred', err)
  } else {
    console.log('succeed')
  }
})

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
  res.send('server testing ok')
})


app.get('/poses', (req: Request, res: Response) => {

  client.query('select * from poses where visible = true order by ordering desc', (error: any, results: { rows: any }) => {
    if (error) throw error

    res.json(results.rows)
  })
})

app.get('/poses/:id', (req: Request, res: Response) => {
  client.query(`select * from poses where visible = true and id = ${req.params.id} order by ordering desc`, (error: any, results: { rows: any }) => {
    if (error) throw error

    res.json(results.rows)
  })
})

app.get('/quiz/poses', (req: Request, res: Response) => {
  let poses: any = []
  let randomNumberArray: number[] = []
  let quizzes: any = []

  client.query('select * from poses where visible = true order by ordering desc', (error: any, results: { rows: any }) => {
    if (error) {
      throw error
    } else {
      poses = results.rows
      while (true) {
        const randomNumber = Math.floor(Math.random() * poses.length);

        if (!randomNumberArray.includes(randomNumber)) {
          let quiz = poses[randomNumber]
          quiz.questionList = [quiz.korean]
          quiz.picked = ''

          while (true) {
            const otherRandomNumber = Math.floor(Math.random() * poses.length)
            if (!quiz.questionList.includes(poses[otherRandomNumber].korean)) {
              const isPush = Math.random() < 0.5
              if (isPush) {
                quiz.questionList.push(poses[otherRandomNumber].korean)
              } else {
                quiz.questionList.unshift(poses[otherRandomNumber].korean)
              }
              if (quiz.questionList.length === 3) break
            }
          }

          quizzes.push(quiz)
        }
        randomNumberArray.push(randomNumber)

        if (quizzes.length === 10) break;
      }
      res.send(quizzes)

    }

  })


})


app.listen(PORT, () => console.log(`Example app listening at http://localhost:${PORT}`))