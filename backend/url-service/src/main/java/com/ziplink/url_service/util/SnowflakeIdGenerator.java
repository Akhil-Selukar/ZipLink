package com.ziplink.url_service.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SnowflakeIdGenerator {
    /**
     * |1 bit | timestamp | machineId | sequence |
     * | 1 bit | 41 bits timestamp | 10 bits machine ID | 12 bits sequence |
     * first bit is always left 0 ensuring that the id generated is always positive.
     */

    private static final long epoch = 1767225600000L; // Jan 1, 2026
    private static final long TIME_CORRECTION_THRESHOLD = 5;    // the code can handle and correct 5 ms of backward clock movement, else it will throw error
    private static final long SEQUENCE_BITS = 12;
    private static final long MACHINE_ID_BITS = 10;
    private static final long MAX_SEQUENCE = (1L << SEQUENCE_BITS) - 1;     // 1<<12 = 4096-1 = 4095 will be max possible value using 12 bits (i.e. sequence)
    private static final long MACHINE_SHIFT = SEQUENCE_BITS;    // we will be shifting machine id to left by 12 bits to make space for sequence id
    private static final long TIMESTAMP_SHIFT = SEQUENCE_BITS + MACHINE_ID_BITS; // will be shifting timestamp by 22 bits to make space for machine id and sequence id

    private static final Logger logger = LoggerFactory.getLogger(SnowflakeIdGenerator.class);
    private long sequence = 0;
    private long lastTimeStamp = -1;
    private final long machineId;

    public SnowflakeIdGenerator(long machineId) {
        if (machineId < 0 || machineId >= (1 << MACHINE_ID_BITS)) {
            logger.error("Invalid machine ID");
            throw new IllegalArgumentException("Invalid machine ID");
        }
        this.machineId = machineId;
    }

    public synchronized long generate() {
        logger.debug("Generating unique ID using snowflakeID generator");
        long currTimeStamp = System.currentTimeMillis();

        // if clock is moved backward
        if (currTimeStamp < lastTimeStamp) {
            logger.warn("Backward clock movement detected");
            long diff = lastTimeStamp - currTimeStamp;
            if(diff <= TIME_CORRECTION_THRESHOLD){
                try {
                    Thread.sleep(diff);
                    currTimeStamp = System.currentTimeMillis();
                } catch(InterruptedException e){
                    Thread.currentThread().interrupt();
                }
            } else {
                logger.error("CLock difference if beyond threshold");
                throw new RuntimeException("Clock moved backwards!");
            }
        }

        if (currTimeStamp == lastTimeStamp) {
            sequence = (sequence + 1) & MAX_SEQUENCE;
            if (sequence == 0) {
                currTimeStamp = waitForNextMillis(lastTimeStamp);
            }
        } else {
            sequence = 0;
        }
        lastTimeStamp = currTimeStamp;

        return ((currTimeStamp - epoch) << TIMESTAMP_SHIFT)
                | (machineId << MACHINE_SHIFT)
                | sequence;
    }

    private long waitForNextMillis(long lastTimestamp) {
        logger.warn("Id per millisecond limit reached.");
        long currTimeStamp = System.currentTimeMillis();
        while (currTimeStamp <= lastTimestamp) {
            currTimeStamp = System.currentTimeMillis();
        }
        return currTimeStamp;
    }
}
