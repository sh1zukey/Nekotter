const express = require('express')
const router = express.Router()

const mysql = require('mysql')
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'tweet-collector',
  password: 'kFJ9EJmNiSc4tUkc',
  database: 'tweet-collector',
  charset: 'utf8mb4'
})

// GET  http://localhost:3000/api/v1/date/latestdate
router.get('/date/latestdate', function(req, res) {
  res.header('Content-Type', 'application/json; charset=utf-8')

  let sql = 'SELECT date FROM `tweets` ORDER BY `id` DESC LIMIT 1'

  sql = mysql.format(sql, req.params.date)

  connection.query(sql, function(error, results, fields) {
    if (error) return res.status(500).send('sql error!')

    res.send({ results: results[0] })
  })
})

// GET  http://localhost:3000/api/v1/date/:date
router.get('/date/:date', function(req, res) {
  res.header('Content-Type', 'application/json; charset=utf-8')

  const regex = /^([1-9][0-9]{3})-(0[1-9]{1}|1[0-2]{1})-(0[1-9]{1}|[1-2]{1}[0-9]{1}|3[0-1]{1})$/
  if (!regex.test(req.params.date))
    return res.status(500).send('parameter is missing!')

  let sql =
    'SELECT id, cast(status_id as char) as status_id, cast(user_id as char) as user_id, user_name, tweet_text, media_urls, date FROM `tweets` WHERE `date` = ? ORDER BY `id` DESC'

  sql = mysql.format(sql, req.params.date)

  connection.query(sql, function(error, results, fields) {
    if (error) return res.status(500).send('sql error!')

    let temp = []
    results.forEach(function(result, index, array) {
      const objMediaUrls = JSON.parse(result.media_urls)
      objMediaUrls.forEach(function(mediaUrl) {
        if ('image' in mediaUrl) {
          temp.push({
            src: mediaUrl.image.url + '&name=orig',
            thumb: mediaUrl.image.url
          })
        } else if ('video' in mediaUrl) {
          temp.push({
            src: mediaUrl.video.url.replace(/\?.*$/, ''),
            thumb: mediaUrl.video.thumb
          })
        }
      })
      results[index].for_lbox_media_urls = temp
      temp = []
    })

    res.send({ results })
  })
})

// GET  http://localhost:3000/api/v1/userid/:id
router.get('/userid/:id', function(req, res) {
  res.header('Content-Type', 'application/json; charset=utf-8')

  const regex = /^[1-9]\d*$/
  if (!regex.test(req.params.id))
    return res.status(500).send('parameter is missing!')

  let sql =
    'SELECT id, cast(status_id as char) as status_id, cast(user_id as char) as user_id, user_name, tweet_text, media_urls, date FROM `tweets` WHERE `user_id` = ? ORDER BY `id` DESC'

  sql = mysql.format(sql, req.params.id)

  connection.query(sql, function(error, results, fields) {
    if (error) return res.status(500).send('sql error!')

    let temp = []
    results.forEach(function(result, index, array) {
      const objMediaUrls = JSON.parse(result.media_urls)
      objMediaUrls.forEach(function(mediaUrl) {
        if ('image' in mediaUrl) {
          temp.push({
            src: mediaUrl.image.url + '&name=orig',
            thumb: mediaUrl.image.url
          })
        } else if ('video' in mediaUrl) {
          temp.push({
            src: mediaUrl.video.url.replace(/\?.*$/, ''),
            thumb: mediaUrl.video.thumb
          })
        }
      })
      results[index].for_lbox_media_urls = temp
      temp = []
    })

    res.send({ results })
  })
})

module.exports = router
