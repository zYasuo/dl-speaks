import { Injectable } from "@nestjs/common";
import type { IClock } from "../../domain/ports/clock.port";

@Injectable()
export class ClockAdapter implements IClock {
    now(): Date {
        return new Date();
    }

    getToday(): Date {
        const d = new Date();
        d.setUTCHours(0, 0, 0, 0);
        return d;
    }
}
