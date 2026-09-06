package com.ziplink.redirect_service.service;

import com.ziplink.common_libs.dto.ClickEvent;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;

@Service
public class ClickEventQueue {
    private final BlockingQueue<ClickEvent> queue =
            new ArrayBlockingQueue<>(100000);

    public boolean offer(ClickEvent event) {
        return queue.offer(event);
    }

    public List<ClickEvent> drainBatch(int maxSize) {
        List<ClickEvent> batch = new ArrayList<>(maxSize);
        queue.drainTo(batch, maxSize);
        return batch;
    }
}
