const express = require('express')
const router = express.Router()

const mysql = require('mysql')
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'tweet-collector',
  password: 'kFJ9EJmNiSc4tUkc',
  database: 'tweet-collector',
  charset: 'utf8mb4',
})

// GET  http://localhost:3000/api/v1/date/latestdate
router.get('/date/latestdate', function (req, res) {
  res.header('Content-Type', 'application/json; charset=utf-8')

  let sql = 'SELECT date FROM `tweets` ORDER BY `id` DESC LIMIT 1'

  sql = mysql.format(sql, req.params.date)

  connection.query(sql, function (error, results, fields) {
    if (error) return res.status(500).send('sql error!')

    res.send({ results: results[0] })
  })
})

// GET  http://localhost:3000/api/v1/date/:date
router.get('/date/:date', function (req, res) {
  res.header('Content-Type', 'application/json; charset=utf-8')

  const regex = /^([1-9][0-9]{3})-(0[1-9]{1}|1[0-2]{1})-(0[1-9]{1}|[1-2]{1}[0-9]{1}|3[0-1]{1})$/
  if (!regex.test(req.params.date))
    return res.status(500).send('parameter is missing!')

  let sql =
    'SELECT SQL_CACHE id, cast(status_id as char) as status_id, cast(user_id as char) as user_id, user_name, tweet_text, media_urls, date, CASE WHEN EXISTS (SELECT id FROM tweets AS sub_tweets WHERE sub_tweets.status_id = tweets.parent_status_id) THEN 1 WHEN EXISTS (SELECT id FROM tweets AS sub_tweets WHERE sub_tweets.parent_status_id = tweets.status_id) THEN 1 ELSE 0 END AS thread_flag FROM `tweets` WHERE `date` = ? ORDER BY `id` DESC'
  sql = mysql.format(sql, req.params.date)

  connection.query(sql, function (error, results, fields) {
    if (error) return res.status(500).send('sql error!')

    res.send({ results: makeResults(results) })
  })
})

// GET  http://localhost:3000/api/v1/userid/:id
router.get('/userid/:id', function (req, res) {
  res.header('Content-Type', 'application/json; charset=utf-8')

  const regex = /^[1-9]\d*$/
  if (!regex.test(req.params.id))
    return res.status(500).send('parameter is missing!')

  let sql =
    'SELECT SQL_CACHE id, cast(status_id as char) as status_id, cast(user_id as char) as user_id, user_name, tweet_text, media_urls, MAX(date) AS date, CASE WHEN EXISTS (SELECT id FROM tweets AS sub_tweets WHERE sub_tweets.status_id = tweets.parent_status_id) THEN 1 WHEN EXISTS (SELECT id FROM tweets AS sub_tweets WHERE sub_tweets.parent_status_id = tweets.status_id) THEN 1 ELSE 0 END AS thread_flag FROM `tweets` WHERE `user_id` = ? GROUP BY status_id ORDER BY `id` DESC'

  sql = mysql.format(sql, req.params.id)

  connection.query(sql, function (error, results, fields) {
    if (error) return res.status(500).send('sql error!')

    res.send({ results: makeResults(results) })
  })
})

// // GET  http://localhost:3000/api/v1/thread/:id
// router.get('/thread/:id', function (req, res) {
//   res.header('Content-Type', 'application/json; charset=utf-8')
//
//   const regex = /^[1-9]\d*$/
//   if (!regex.test(req.params.id))
//     return res.status(500).send('parameter is missing!')
//
//   let sql =
//     'WITH RECURSIVE cte1 (id, status_id, user_id, user_name, tweet_text, media_urls, date, parent_status_id) as ( SELECT id, status_id, user_id, user_name, tweet_text, media_urls, date, parent_status_id FROM tweets WHERE parent_status_id = ? UNION ALL SELECT temp.id, temp.status_id, temp.user_id, temp.user_name, temp.tweet_text, temp.media_urls, temp.date, temp.parent_status_id FROM tweets temp INNER JOIN cte1 ON temp.parent_status_id = cte1.status_id ), cte2 (id, status_id, user_id, user_name, tweet_text, media_urls, date, parent_status_id ) as ( SELECT id, status_id, user_id, user_name, tweet_text, media_urls, date, parent_status_id FROM tweets WHERE status_id = ? UNION ALL SELECT temp.id, temp.status_id, temp.user_id, temp.user_name, temp.tweet_text, temp.media_urls, temp.date, temp.parent_status_id FROM tweets temp INNER JOIN cte2 ON temp.status_id = cte2.parent_status_id ) SELECT id, cast(status_id as char) as status_id, cast(user_id as char) as user_id, user_name, tweet_text, media_urls, MAX(date) AS date FROM cte1 GROUP BY status_id UNION SELECT id, cast(status_id as char) as status_id, cast(user_id as char) as user_id, user_name, tweet_text, media_urls, MAX(date) AS date FROM cte2 GROUP BY status_id ORDER BY LPAD(status_id, 20, 0) ASC'
//   sql = mysql.format(sql, [req.params.id, req.params.id])
//
//   connection.query(sql, function (error, results, fields) {
//     if (error) return res.status(500).send('sql error!')
//
//     res.send({ results: makeResults(results) })
//   })
// })

// GET  http://localhost:3000/api/v1/thread/:id
router.get('/thread/:id', function (req, res) {
  res.header('Content-Type', 'application/json; charset=utf-8')

  const regex = /^[1-9]\d*$/
  if (!regex.test(req.params.id))
    return res.status(500).send('parameter is missing!')

  let resultCte1
  let resultCte2

  const cte1 = new Promise(function (resolve, reject) {
    let sql =
      'WITH RECURSIVE\n' +
      ' cte1 (id, status_id, user_id, user_name, tweet_text, media_urls, date, parent_status_id) as ( SELECT id, status_id, user_id, user_name, tweet_text, media_urls, date, parent_status_id\n' +
      ' FROM tweets\n' +
      ' WHERE parent_status_id = ?\n' +
      ' UNION ALL SELECT temp.id, temp.status_id, temp.user_id, temp.user_name, temp.tweet_text, temp.media_urls, temp.date, temp.parent_status_id\n' +
      ' FROM tweets temp\n' +
      ' INNER JOIN cte1 ON temp.parent_status_id = cte1.status_id )\n' +
      ' SELECT id, cast(status_id as char) as status_id, cast(user_id as char) as user_id, user_name, tweet_text, media_urls, MAX(date) AS date\n' +
      ' FROM cte1\n' +
      ' GROUP BY cte1.status_id'
    sql = mysql.format(sql.replace(/\r?\n/g, ' '), [req.params.id])

    connection.query(sql, function (error, results, fields) {
      if (error) throw new Error('sql error!')

      resultCte1 = results
      resolve()
    })
  })

  const cte2 = new Promise(function (resolve, reject) {
    let sql =
      'WITH RECURSIVE\n' +
      'cte2 (id, status_id, user_id, user_name, tweet_text, media_urls, date, parent_status_id ) as ( SELECT id, status_id, user_id, user_name, tweet_text, media_urls, date, parent_status_id\n' +
      ' FROM tweets\n' +
      ' WHERE status_id = ?\n' +
      ' UNION ALL SELECT temp.id, temp.status_id, temp.user_id, temp.user_name, temp.tweet_text, temp.media_urls, temp.date, temp.parent_status_id\n' +
      ' FROM tweets temp\n' +
      ' INNER JOIN cte2 ON temp.status_id = cte2.parent_status_id )\n' +
      ' SELECT id, cast(status_id as char) as status_id, cast(user_id as char) as user_id, user_name, tweet_text, media_urls, MAX(date) AS date\n' +
      ' FROM cte2\n' +
      ' GROUP BY cte2.status_id'
    sql = mysql.format(sql.replace(/\r?\n/g, ' '), [req.params.id])

    connection.query(sql, function (error, results, fields) {
      if (error) throw new Error('sql error!')

      resultCte2 = results
      resolve()
    })
  })

  Promise.all([cte1, cte2])
    .then(function () {
      res.send({ results: makeResults(resultCte2.concat(resultCte1)) })
    })
    .catch(function (reason) {
      res.status(500).send(reason)
    })
})

// GET  http://localhost:3000/api/v1/random
router.get('/random', function (req, res) {
  res.header('Content-Type', 'application/json; charset=utf-8')

  const sql =
    'SELECT id, cast(status_id as char) as status_id, cast(user_id as char) as user_id, user_name, tweet_text, media_urls, date, CASE WHEN EXISTS (SELECT id FROM tweets AS sub_tweets WHERE sub_tweets.status_id = tweets.parent_status_id) THEN 1 WHEN EXISTS (SELECT id FROM tweets AS sub_tweets WHERE sub_tweets.parent_status_id = tweets.status_id) THEN 1 ELSE 0 END AS thread_flag FROM `tweets`WHERE RAND() <= (SELECT 100/COUNT(id) FROM tweets) ORDER BY RAND() LIMIT 36'

  connection.query(sql, function (error, results, fields) {
    if (error) return res.status(500).send('sql error!')

    res.send({ results: makeResults(results) })
  })
})

function makeResults(results) {
  let temp = []
  let videoFlag = 0
  results.forEach(function (result, index, array) {
    const objMediaUrls = JSON.parse(result.media_urls)
    objMediaUrls.forEach(function (mediaUrl) {
      if ('image' in mediaUrl) {
        temp.push({
          src: mediaUrl.image.url + '&name=orig',
          thumb: mediaUrl.image.url,
        })
      } else if ('video' in mediaUrl) {
        temp.push({
          src: mediaUrl.video.url,
          thumb: mediaUrl.video.thumb,
          autoplay: true,
        })
        videoFlag = 1
      }
    })
    results[index].for_lbox_media_urls = temp
    results[index].video_flag = videoFlag

    delete results[index].media_urls

    temp = []
    videoFlag = 0
  })

  return results
}

module.exports = router
