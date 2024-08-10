const Jobs = require('../models/Job');
const {StatusCodes} = require('http-status-codes')
const {CustomAPIError} = require("../errors");

const getAllJobs =async (req, res) => {
    const jobs = await Jobs.find({createdBy:req.user.userId})
    res.status(StatusCodes.OK).json({
        success: true,
        length: jobs.length,
        data: jobs
    })
}

const getJob =async (req, res) => {
    const {id} = req.params
    const job = await Jobs.findById(id)
    const createdBy =  job.createdBy.toString()

    if (createdBy !== req.user.userId) {
        throw new CustomAPIError(`job with id ${id} does not belong to you`,StatusCodes.UNAUTHORIZED)
    }
    if (!job){
        throw new CustomAPIError(`job with id ${id} not found`,StatusCodes.NOT_FOUND)
    }

   res.status(StatusCodes.OK).json({
       success: true,
       data: job
   })
}
const createJob =async (req, res) => {
        req.body.createdBy = req.user.userId;
        const job = await Jobs.create(req.body)
        res.status(StatusCodes.CREATED).json({
            success: true,
            data:job
        })
}
const updateJob =async (req, res) => {
    const {
        body:{company,position},
        params:{id:jobId},
        user:{userId}
    } = req

    if (company === '' || position === '' || !company || !position){
        throw new CustomAPIError('please provide company and position',StatusCodes.BAD_REQUEST)
    }

    const job = await Jobs.findOneAndUpdate({_id:jobId,createdBy:userId},req.body,{new: true,runValidators:true})

    if (!job){
        throw new CustomAPIError(`job with id ${jobId} not found`,StatusCodes.NOT_FOUND)
    }

    res.status(StatusCodes.OK).json({
        success:true,
        data:job
    })
}
const deleteJob =async (req, res) => {
    const {
        params:{id:jobId},
        user:{userId}
    } = req

    const job = await Jobs.findOneAndDelete({_id:jobId,createdBy:userId})

    if (!job){
        throw new CustomAPIError(`job with id ${jobId} not found`,StatusCodes.NOT_FOUND)
    }

    res.status(StatusCodes.OK).json({
        success:true,
        message:'Job deleted successfully'
    })
}

module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob,
}
