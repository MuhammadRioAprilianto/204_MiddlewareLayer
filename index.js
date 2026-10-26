import express from 'express'
import pg from 'pg'
import joi from 'joi'

import express from 'express'
import pg from 'pg'
import joi from 'joi'

const pool = new Pool({
    user: 'rizoo',
    host: 'localhost',
    database: 'mahasiswa',
    password: 'R2i8o0406',
    port: 5432,
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
    const start = Date.now()

    res.on('finish', () => {
        const duration = Date.now() - start

        console.log({
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration: `${duration}ms`,
        })
    })
    next()
})

function successResponse(res, message, data, status = 200) {
    return res.status(status).json({
        status: 'success',
        message,
        data,
        error: null,
    })
}