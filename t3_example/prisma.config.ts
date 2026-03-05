import {defineConfig } from "prisma/config";

import { config } from 'dotenv';
config();

export default defineConfig ({
    schema: "prisma/schema.prisma",
    migrations :{
        seed: "tsx prisma/seed.ts"
    }
    
});