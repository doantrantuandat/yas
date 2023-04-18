package com.yas.inventory.viewmodel.warehouse;

import java.util.List;

public record WarehouseListGetVm(
    List<WarehouseVm> warehouseContent,
    int pageNo,
    int pageSize,
    int totalElements,
    int totalPages,
    boolean isLast
) {

}
