package com.yas.inventory.service;

import com.yas.inventory.exception.DuplicatedException;
import com.yas.inventory.exception.NotFoundException;
import com.yas.inventory.model.Warehouse;
import com.yas.inventory.repository.WarehouseRepository;
import com.yas.inventory.constants.MessageCode;
import com.yas.inventory.viewmodel.address.AddressDetailVm;
import com.yas.inventory.viewmodel.warehouse.WarehouseDetailVm;
import com.yas.inventory.viewmodel.warehouse.WarehouseListGetVm;
import com.yas.inventory.viewmodel.warehouse.WarehousePostVm;
import com.yas.inventory.viewmodel.warehouse.WarehouseVm;

import java.util.List;

import com.yas.inventory.viewmodel.address.AddressPostVm;
import com.yas.inventory.viewmodel.address.AddressVm;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class WarehouseService {

    private final WarehouseRepository warehouseRepository;
    private final LocationService locationService;

    public WarehouseService(WarehouseRepository warehouseRepository, LocationService locationService) {
        this.warehouseRepository = warehouseRepository;
        this.locationService = locationService;
    }

    @Transactional(readOnly = true)
    public List<WarehouseVm> findAllWarehouses() {
        return warehouseRepository
                .findAll()
                .stream()
                .map(WarehouseVm::fromModel)
                .toList();
    }

    @Transactional(readOnly = true)
    public WarehouseDetailVm findById(final Long id) {
        final Warehouse warehouse = warehouseRepository
                .findById(id)
                .orElseThrow(
                        () -> new NotFoundException(MessageCode.WAREHOUSE_NOT_FOUND, id));
        AddressDetailVm addressDetailVm = locationService.getAddressById(warehouse.getAddressId());
        WarehouseDetailVm warehouseDetailVm = new WarehouseDetailVm(
                warehouse.getId(),
                warehouse.getName(),
                addressDetailVm.contactName(),
                addressDetailVm.phone(),
                addressDetailVm.addressLine1(),
                addressDetailVm.addressLine2(),
                addressDetailVm.city(),
                addressDetailVm.zipCode(),
                addressDetailVm.districtId(),
                addressDetailVm.stateOrProvinceId(),
                addressDetailVm.countryId()

        );
      return warehouseDetailVm;
    }

    @Transactional
    public Warehouse create(final WarehousePostVm warehousePostVm) {
        if (warehouseRepository.existsByName(warehousePostVm.name())) {
            throw new DuplicatedException(MessageCode.NAME_ALREADY_EXITED, warehousePostVm.name());
        }
        AddressPostVm addressPostVm = new AddressPostVm(
                warehousePostVm.contactName(),
                warehousePostVm.phone(),
                warehousePostVm.addressLine1(),
                warehousePostVm.addressLine2(),
                warehousePostVm.city(),
                warehousePostVm.zipCode(),
                warehousePostVm.districtId(),
                warehousePostVm.stateOrProvinceId(),
                warehousePostVm.countryId()
                );


        AddressVm addressVm = locationService.createAddress(addressPostVm);
        Warehouse warehouse = new Warehouse();
        warehouse.setName(warehousePostVm.name());
        warehouse.setAddressId(addressVm.id());
        return warehouseRepository.save(warehouse);
    }

    @Transactional
    public void update(final WarehousePostVm warehousePostVm, final Long id) {
        final Warehouse warehouse = warehouseRepository
                .findById(id)
                .orElseThrow(() -> new NotFoundException(MessageCode.WAREHOUSE_NOT_FOUND, id));

        //For the updating case we don't need to check for the Warehouse being updated
        if (warehouseRepository.existsByNameNotUpdatingWarehouse(warehousePostVm.name(), id)) {
            throw new DuplicatedException(MessageCode.NAME_ALREADY_EXITED, warehousePostVm.name());
        }
        warehouse.setName(warehousePostVm.name());

        AddressPostVm addressPostVm = new AddressPostVm(
                warehousePostVm.contactName(),
                warehousePostVm.phone(),
                warehousePostVm.addressLine1(),
                warehousePostVm.addressLine2(),
                warehousePostVm.city(),
                warehousePostVm.zipCode(),
                warehousePostVm.districtId(),
                warehousePostVm.stateOrProvinceId(),
                warehousePostVm.countryId()
        );

        locationService.updateAddress(warehouse.getAddressId(), addressPostVm);
        warehouseRepository.save(warehouse);
    }

    @Transactional
    public void delete(final Long id) {
        final Warehouse warehouse = warehouseRepository
                .findById(id)
                .orElseThrow(() -> new NotFoundException(MessageCode.WAREHOUSE_NOT_FOUND, id));

        warehouseRepository.deleteById(id);
        locationService.deleteAddress(warehouse.getAddressId());
    }

    @Transactional(readOnly = true)
    public WarehouseListGetVm getPageableWarehouses(final int pageNo, final int pageSize) {
        final Pageable pageable = PageRequest.of(pageNo, pageSize);
        final Page<Warehouse> warehousePage = warehouseRepository.findAll(pageable);
        final List<Warehouse> warehouseList = warehousePage.getContent();

        final List<WarehouseVm> warehouseVms = warehouseList.stream()
                .map(WarehouseVm::fromModel)
                .toList();

        return new WarehouseListGetVm(
                warehouseVms,
                warehousePage.getNumber(),
                warehousePage.getSize(),
                (int) warehousePage.getTotalElements(),
                warehousePage.getTotalPages(),
                warehousePage.isLast()
        );
    }
}
