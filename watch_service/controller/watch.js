import {PrismaClient} from '@prisma/client';
const prisma = new PrismaClient();

export let getAllVideos = (async (req, res) => {

    const response = await prisma.$queryRaw`SELECT * from "Videos"`;

    res.status(200).json({videos: response});
});