import { dataSource } from "../config/db";
import { createFixtures } from "./fixtures";

async function launchFixtures() {
    await dataSource.initialize()
    await createFixtures()
}

launchFixtures()
