package com.yas.inventory.viewmodel.warehouse;

import com.yas.inventory.model.Warehouse;

public record WarehouseVm(Long id, String name) {

    public static WarehouseVm fromModel(Warehouse warehouse) {
        return new WarehouseVm(warehouse.getId(), warehouse.getName());
    }
}
