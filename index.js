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

function errorResponse(res, message, status, details = null) {
    return res.status(status).json({
        success: false,
        message,
        data: null,
        error: details,
    })
}

const biodataSchema = joi.object({
    id: joi.number().integer().positive(),
    nama: joi.string().trim().min(2).max(100).required(),
    nim: joi.string().trim().min(5).max(20).required(),
    kelas: joi.string().trim().min(1).max(20).required(),
})

const idSchema = joi.object({
    id: joi.number().integer().positive().required(),
})

//Middleware untuk validasi body
function validateBody(schema) {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            convert: true,
            allowUnknown: false,
        })

        if (error) {
            return errorResponse(
                res,
                'Validasi input gagal',
                400,
                error,details.map(item => ({
                    field: item.path.join('.'),
                    message: item.message,
                }))
            )
        }    
    }
}

//Middleware untuk validasi parameter id
function validateIdParam(schema) {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.params)

        if (error) {
            return errorResponse(
                res,
                'Parameter tidak valid',
                400,
                error.details.map(item => ({
                    field: item.path.join('.'),
                    message: item.message,
                }))
            )
        }

        req.params = value
        next()
    }
}

app.get('/', async (req, res) => {
    const result = await pol.query(
        'SELECT * FROM biodata ORDER BY id'
    )

    return successResponse(
        res,
        'Data berhasil diambil',
        result.rows
    )
})

pp.post(
    '/biodata',
    validateBody(biodataSchema),
    async (req, res) => {
        const { id, nama, nim, kelas } = req.body

        const result = await pol.query(
            'INSERT INTO biodata (id, nama, nim, kelas) VALUES ($1, $2, $3, $4) RETURNING *',
            [id ?? null, nama, nim, kelas]
        )

        return successResponse(
            res,
            'Data berhasil ditambahkan',
            result.rows[0],
            201
        )
    }
)

app.put(
    '/biodata/:id',
    validateIdParam(idSchema),
    validateBody(biodataSchema.fork(
        ['nama', 'nim', 'kelas'],
        field => field.required()
    ).fork(['id'], field => field.forbidden())),
    async (req, res) => {
        const { id } = req.params
        const { nama, nim, kelas } = req.body

        const result = await pol.query(
            'UPDATE biodata SET nama = $1, nim = $2, kelas = $3 WHERE id = $4 RETURNING *',
            [nama, nim, kelas, id]
        )

        if (result.rowCount === 0) {
            return errorResponse(
                res, 'Data tidak ditemukan', 404
            )
        }

        return successResponse(
            res,
            'Data berhasil diperbarui',
            result.rows[0]
        )
    }
)

app.delete(
    '/biodata/:id',
    validateIdParam(idSchema),
    async (req, res) => {
        const { id } = req.params

        const result = await pol.query(
            'DELETE FROM biodata WHERE id = $1 RETURNING *',
            [id]
        )
        
        if (result.rowCount === 0) {
            return errorResponse(
                res, 'Data tidak ditemukan', 404
            )
        }

        return successResponse(
            res,
            'Data berhasil dihapus',
            result.rows[0]
        )
    }
)

// ROUTE TIDAK DITEMUKAN

app.use((req, res) => {
    return errorResponse(
        res,
        'Endpoint tidak ditemukan',
        404
    )
})