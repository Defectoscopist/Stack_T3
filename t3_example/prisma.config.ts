//import type { defaultConfig } from "next/dist/server/config-shared";
import {defineConfig } from "prisma/config";

import { config } from 'dotenv';
config();

export default defineConfig ({
    schema: "prisma/schema.prisma",
    seed: "tsx prisma/seed.ts"
});