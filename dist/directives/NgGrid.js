"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var NgGridPlaceholder_1 = require('../components/NgGridPlaceholder');
var NgGrid = (function () {
    //	Constructor
    function NgGrid(_differs, _ngEl, _renderer, componentFactoryResolver, _containerRef) {
        this._differs = _differs;
        this._ngEl = _ngEl;
        this._renderer = _renderer;
        this.componentFactoryResolver = componentFactoryResolver;
        this._containerRef = _containerRef;
        //	Event Emitters
        this.onDragStart = new core_1.EventEmitter();
        this.onDrag = new core_1.EventEmitter();
        this.onDragStop = new core_1.EventEmitter();
        this.onResizeStart = new core_1.EventEmitter();
        this.onResize = new core_1.EventEmitter();
        this.onResizeStop = new core_1.EventEmitter();
        this.onItemChange = new core_1.EventEmitter();
        //	Public variables
        this.colWidth = 250;
        this.rowHeight = 250;
        this.minCols = 1;
        this.minRows = 1;
        this.marginTop = 10;
        this.marginRight = 10;
        this.marginBottom = 10;
        this.marginLeft = 10;
        this.isDragging = false;
        this.isResizing = false;
        this.autoStyle = true;
        this.resizeEnable = true;
        this.dragEnable = true;
        this.cascade = 'up';
        this.minWidth = 100;
        this.minHeight = 100;
        //	Private variables
        this._items = [];
        this._draggingItem = null;
        this._resizingItem = null;
        this._resizeDirection = null;
        this._itemGrid = { 1: { 1: null } };
        this._maxCols = 0;
        this._maxRows = 0;
        this._visibleCols = 0;
        this._visibleRows = 0;
        this._setWidth = 250;
        this._setHeight = 250;
        this._posOffset = null;
        this._adding = false;
        this._placeholderRef = null;
        this._fixToGrid = false;
        this._autoResize = false;
        this._destroyed = false;
        this._maintainRatio = false;
        this._preferNew = false;
        this._zoomOnDrag = false;
        this._limitToScreen = false;
        this._curMaxRow = 0;
        this._curMaxCol = 0;
        this._config = NgGrid.CONST_DEFAULT_CONFIG;
    }
    Object.defineProperty(NgGrid.prototype, "config", {
        //	[ng-grid] attribute handler
        set: function (v) {
            this.setConfig(v);
            if (this._differ == null && v != null) {
                this._differ = this._differs.find(this._config).create(null);
            }
        },
        enumerable: true,
        configurable: true
    });
    //	Public methods
    NgGrid.prototype.ngOnInit = function () {
        this._renderer.setElementClass(this._ngEl.nativeElement, 'grid', true);
        if (this.autoStyle)
            this._renderer.setElementStyle(this._ngEl.nativeElement, 'position', 'relative');
        this.setConfig(this._config);
    };
    NgGrid.prototype.ngOnDestroy = function () {
        this._destroyed = true;
    };
    NgGrid.prototype.setConfig = function (config) {
        this._config = config;
        var maxColRowChanged = false;
        for (var x in config) {
            var val = config[x];
            var intVal = !val ? 0 : parseInt(val);
            switch (x) {
                case 'margins':
                    this.setMargins(val);
                    break;
                case 'col_width':
                    this.colWidth = Math.max(intVal, 1);
                    break;
                case 'row_height':
                    this.rowHeight = Math.max(intVal, 1);
                    break;
                case 'auto_style':
                    this.autoStyle = val ? true : false;
                    break;
                case 'auto_resize':
                    this._autoResize = val ? true : false;
                    break;
                case 'draggable':
                    this.dragEnable = val ? true : false;
                    break;
                case 'resizable':
                    this.resizeEnable = val ? true : false;
                    break;
                case 'max_rows':
                    maxColRowChanged = maxColRowChanged || this._maxRows != intVal;
                    this._maxRows = intVal < 0 ? 0 : intVal;
                    break;
                case 'max_cols':
                    maxColRowChanged = maxColRowChanged || this._maxCols != intVal;
                    this._maxCols = intVal < 0 ? 0 : intVal;
                    break;
                case 'visible_rows':
                    this._visibleRows = Math.max(intVal, 0);
                    break;
                case 'visible_cols':
                    this._visibleCols = Math.max(intVal, 0);
                    break;
                case 'min_rows':
                    this.minRows = Math.max(intVal, 1);
                    break;
                case 'min_cols':
                    this.minCols = Math.max(intVal, 1);
                    break;
                case 'min_height':
                    this.minHeight = Math.max(intVal, 1);
                    break;
                case 'min_width':
                    this.minWidth = Math.max(intVal, 1);
                    break;
                case 'zoom_on_drag':
                    this._zoomOnDrag = val ? true : false;
                    break;
                case 'cascade':
                    if (this.cascade != val) {
                        this.cascade = val;
                        this._cascadeGrid();
                    }
                    break;
                case 'fix_to_grid':
                    this._fixToGrid = val ? true : false;
                    break;
                case 'maintain_ratio':
                    this._maintainRatio = val ? true : false;
                    break;
                case 'prefer_new':
                    this._preferNew = val ? true : false;
                    break;
                case 'limit_to_screen':
                    this._limitToScreen = val ? true : false;
                    break;
            }
        }
        if (this._maintainRatio) {
            if (this.colWidth && this.rowHeight) {
                this._aspectRatio = this.colWidth / this.rowHeight;
            }
            else {
                this._maintainRatio = false;
            }
        }
        if (maxColRowChanged) {
            if (this._maxCols > 0 && this._maxRows > 0) {
                switch (this.cascade) {
                    case 'left':
                    case 'right':
                        this._maxCols = 0;
                        break;
                    case 'up':
                    case 'down':
                    default:
                        this._maxRows = 0;
                        break;
                }
            }
            for (var _i = 0, _a = this._items; _i < _a.length; _i++) {
                var item = _a[_i];
                var pos = item.getGridPosition();
                var dims = item.getSize();
                this._removeFromGrid(item);
                if (this._maxCols > 0 && dims.x > this._maxCols) {
                    dims.x = this._maxCols;
                    item.setSize(dims);
                }
                else if (this._maxRows > 0 && dims.y > this._maxRows) {
                    dims.y = this._maxRows;
                    item.setSize(dims);
                }
                if (this._hasGridCollision(pos, dims) || !this._isWithinBounds(pos, dims)) {
                    var newPosition = this._fixGridPosition(pos, dims);
                    item.setGridPosition(newPosition);
                }
                this._addToGrid(item);
            }
            this._cascadeGrid();
        }
        this._calculateRowHeight();
        this._calculateColWidth();
        var maxWidth = this._maxCols * this.colWidth;
        var maxHeight = this._maxRows * this.rowHeight;
        if (maxWidth > 0 && this.minWidth > maxWidth)
            this.minWidth = 0.75 * this.colWidth;
        if (maxHeight > 0 && this.minHeight > maxHeight)
            this.minHeight = 0.75 * this.rowHeight;
        if (this.minWidth > this.colWidth)
            this.minCols = Math.max(this.minCols, Math.ceil(this.minWidth / this.colWidth));
        if (this.minHeight > this.rowHeight)
            this.minRows = Math.max(this.minRows, Math.ceil(this.minHeight / this.rowHeight));
        if (this._maxCols > 0 && this.minCols > this._maxCols)
            this.minCols = 1;
        if (this._maxRows > 0 && this.minRows > this._maxRows)
            this.minRows = 1;
        this._updateRatio();
        for (var _b = 0, _c = this._items; _b < _c.length; _b++) {
            var item = _c[_b];
            this._removeFromGrid(item);
            item.setCascadeMode(this.cascade);
        }
        this._updateLimit();
        for (var _d = 0, _e = this._items; _d < _e.length; _d++) {
            var item = _e[_d];
            item.recalculateSelf();
            this._addToGrid(item);
        }
        this._cascadeGrid();
        this._updateSize();
    };
    NgGrid.prototype.getItemPosition = function (index) {
        return this._items[index].getGridPosition();
    };
    NgGrid.prototype.getItemSize = function (index) {
        return this._items[index].getSize();
    };
    NgGrid.prototype.ngDoCheck = function () {
        if (this._differ != null) {
            var changes = this._differ.diff(this._config);
            if (changes != null) {
                this._applyChanges(changes);
                return true;
            }
        }
        return false;
    };
    NgGrid.prototype.setMargins = function (margins) {
        this.marginTop = Math.max(parseInt(margins[0]), 0);
        this.marginRight = margins.length >= 2 ? Math.max(parseInt(margins[1]), 0) : this.marginTop;
        this.marginBottom = margins.length >= 3 ? Math.max(parseInt(margins[2]), 0) : this.marginTop;
        this.marginBottom = margins.length >= 3 ? Math.max(parseInt(margins[2]), 0) : this.marginTop;
        this.marginLeft = margins.length >= 4 ? Math.max(parseInt(margins[3]), 0) : this.marginRight;
    };
    NgGrid.prototype.enableDrag = function () {
        this.dragEnable = true;
    };
    NgGrid.prototype.disableDrag = function () {
        this.dragEnable = false;
    };
    NgGrid.prototype.enableResize = function () {
        this.resizeEnable = true;
    };
    NgGrid.prototype.disableResize = function () {
        this.resizeEnable = false;
    };
    NgGrid.prototype.addItem = function (ngItem) {
        ngItem.setCascadeMode(this.cascade);
        if (!this._preferNew) {
            var newPos = this._fixGridPosition(ngItem.getGridPosition(), ngItem.getSize());
            ngItem.savePosition(newPos);
        }
        this._items.push(ngItem);
        this._addToGrid(ngItem);
        ngItem.recalculateSelf();
        ngItem.onCascadeEvent();
    };
    NgGrid.prototype.removeItem = function (ngItem) {
        this._removeFromGrid(ngItem);
        for (var x = 0; x < this._items.length; x++) {
            if (this._items[x] == ngItem) {
                this._items.splice(x, 1);
            }
        }
        if (this._destroyed)
            return;
        this._cascadeGrid();
        this._updateSize();
        this._items.forEach(function (item) { return item.recalculateSelf(); });
    };
    NgGrid.prototype.updateItem = function (ngItem) {
        this._removeFromGrid(ngItem);
        this._addToGrid(ngItem);
        this._cascadeGrid();
        this._updateSize();
        ngItem.onCascadeEvent();
    };
    NgGrid.prototype.triggerCascade = function () {
        this._cascadeGrid(null, null, false);
    };
    //	Private methods
    NgGrid.prototype._calculateColWidth = function () {
        if (this._autoResize) {
            if (this._maxCols > 0 || this._visibleCols > 0) {
                var maxCols = this._maxCols > 0 ? this._maxCols : this._visibleCols;
                var maxWidth = this._ngEl.nativeElement.getBoundingClientRect().width;
                var colWidth = Math.floor(maxWidth / maxCols);
                colWidth -= (this.marginLeft + this.marginRight);
                if (colWidth > 0)
                    this.colWidth = colWidth;
                if (this.colWidth < this.minWidth || this.minCols > this._config.min_cols) {
                    this.minCols = Math.max(this._config.min_cols, Math.ceil(this.minWidth / this.colWidth));
                }
            }
        }
    };
    NgGrid.prototype._calculateRowHeight = function () {
        if (this._autoResize) {
            if (this._maxRows > 0 || this._visibleRows > 0) {
                var maxRows = this._maxRows > 0 ? this._maxRows : this._visibleRows;
                var maxHeight = window.innerHeight;
                var rowHeight = Math.max(Math.floor(maxHeight / maxRows), this.minHeight);
                rowHeight -= (this.marginTop + this.marginBottom);
                if (rowHeight > 0)
                    this.rowHeight = rowHeight;
                if (this.rowHeight < this.minHeight || this.minRows > this._config.min_rows) {
                    this.minRows = Math.max(this._config.min_rows, Math.ceil(this.minHeight / this.rowHeight));
                }
            }
        }
    };
    NgGrid.prototype._updateRatio = function () {
        if (this._autoResize && this._maintainRatio) {
            if (this._maxCols > 0 && this._visibleRows <= 0) {
                this.rowHeight = this.colWidth / this._aspectRatio;
            }
            else if (this._maxRows > 0 && this._visibleCols <= 0) {
                this.colWidth = this._aspectRatio * this.rowHeight;
            }
            else if (this._maxCols == 0 && this._maxRows == 0) {
                if (this._visibleCols > 0) {
                    this.rowHeight = this.colWidth / this._aspectRatio;
                }
                else if (this._visibleRows > 0) {
                    this.colWidth = this._aspectRatio * this.rowHeight;
                }
            }
        }
    };
    NgGrid.prototype._updateLimit = function () {
        if (!this._autoResize && this._limitToScreen) {
            this._limitGrid(this._getContainerColumns());
        }
    };
    NgGrid.prototype._onResize = function (e) {
        this._calculateColWidth();
        this._calculateRowHeight();
        this._updateRatio();
        for (var _i = 0, _a = this._items; _i < _a.length; _i++) {
            var item = _a[_i];
            this._removeFromGrid(item);
        }
        this._updateLimit();
        for (var _b = 0, _c = this._items; _b < _c.length; _b++) {
            var item = _c[_b];
            this._addToGrid(item);
            item.recalculateSelf();
        }
        this._updateSize();
    };
    NgGrid.prototype._applyChanges = function (changes) {
        var _this = this;
        changes.forEachAddedItem(function (record) { _this._config[record.key] = record.currentValue; });
        changes.forEachChangedItem(function (record) { _this._config[record.key] = record.currentValue; });
        changes.forEachRemovedItem(function (record) { delete _this._config[record.key]; });
        this.setConfig(this._config);
    };
    NgGrid.prototype._onMouseDown = function (e) {
        var mousePos = this._getMousePosition(e);
        var item = this._getItemFromPosition(mousePos);
        if (item != null) {
            if (this.resizeEnable && item.canResize(e) != null) {
                this._resizeStart(e);
                return false;
            }
        }
        return true;
    };
    NgGrid.prototype._resizeStart = function (e) {
        if (this.resizeEnable) {
            var mousePos = this._getMousePosition(e);
            var item = this._getItemFromPosition(mousePos);
            item.startMoving();
            this._resizingItem = item;
            this._resizeDirection = item.canResize(e);
            this._removeFromGrid(item);
            this._createPlaceholder(item);
            this.isResizing = true;
            this.onResizeStart.emit(item);
            item.onResizeStartEvent();
        }
    };
    NgGrid.prototype._dragStart = function (e) {
        if (this.dragEnable) {
            var mousePos = this._getMousePosition(e);
            var item = this._getItemFromPosition(mousePos);
            var itemPos = item.getPosition();
            var pOffset = { 'left': (mousePos.left - itemPos.left), 'top': (mousePos.top - itemPos.top) };
            item.startMoving();
            this._draggingItem = item;
            this._posOffset = pOffset;
            this._removeFromGrid(item);
            this._createPlaceholder(item);
            this.isDragging = true;
            this.onDragStart.emit(item);
            item.onDragStartEvent();
            if (this._zoomOnDrag) {
                this._zoomOut();
            }
        }
    };
    NgGrid.prototype._zoomOut = function () {
        this._renderer.setElementStyle(this._ngEl.nativeElement, 'transform', 'scale(0.5, 0.5)');
    };
    NgGrid.prototype._resetZoom = function () {
        this._renderer.setElementStyle(this._ngEl.nativeElement, 'transform', '');
    };
    NgGrid.prototype._onMouseMove = function (e) {
        if (e.buttons == 1 && this.dragEnable && !this.isDragging && !this.isResizing) {
            var mousePos = this._getMousePosition(e);
            var item = this._getItemFromPosition(mousePos);
            if (item != null && item.canDrag(e)) {
                this._dragStart(e);
                return false;
            }
        }
        if (e.buttons == 0 && this.isDragging) {
            this._dragStop(e);
        }
        else if (e.buttons == 0 && this.isResizing) {
            this._resizeStop(e);
        }
        else if (this.isDragging) {
            this._drag(e);
        }
        else if (this.isResizing) {
            this._resize(e);
        }
        else {
            var mousePos = this._getMousePosition(e);
            var item = this._getItemFromPosition(mousePos);
            if (item) {
                item.onMouseMove(e);
            }
        }
        return true;
    };
    NgGrid.prototype._drag = function (e) {
        if (this.isDragging) {
            var mousePos = this._getMousePosition(e);
            var newL = (mousePos.left - this._posOffset.left);
            var newT = (mousePos.top - this._posOffset.top);
            var itemPos = this._draggingItem.getGridPosition();
            var gridPos = this._calculateGridPosition(newL, newT);
            var dims = this._draggingItem.getSize();
            if (!this._isWithinBoundsX(gridPos, dims))
                gridPos.col = this._maxCols - (dims.x - 1);
            if (!this._isWithinBoundsY(gridPos, dims))
                gridPos.row = this._maxRows - (dims.y - 1);
            if (!this._autoResize && this._limitToScreen) {
                if ((gridPos.col + dims.x - 1) > this._getContainerColumns()) {
                    gridPos.col = this._getContainerColumns() - (dims.x - 1);
                }
            }
            if (gridPos.col != itemPos.col || gridPos.row != itemPos.row) {
                this._draggingItem.setGridPosition(gridPos, this._fixToGrid);
                this._placeholderRef.instance.setGridPosition(gridPos);
                if (['up', 'down', 'left', 'right'].indexOf(this.cascade) >= 0) {
                    this._fixGridCollisions(gridPos, dims, true);
                    this._cascadeGrid(gridPos, dims);
                }
            }
            if (!this._fixToGrid) {
                this._draggingItem.setPosition(newL, newT);
            }
            this.onDrag.emit(this._draggingItem);
            this._draggingItem.onDragEvent();
        }
    };
    NgGrid.prototype._resize = function (e) {
        if (this.isResizing) {
            var mousePos = this._getMousePosition(e);
            var itemPos = this._resizingItem.getPosition();
            var itemDims = this._resizingItem.getDimensions();
            var newW = this._resizeDirection == 'height' ? itemDims.width : (mousePos.left - itemPos.left + 10);
            var newH = this._resizeDirection == 'width' ? itemDims.height : (mousePos.top - itemPos.top + 10);
            if (newW < this.minWidth)
                newW = this.minWidth;
            if (newH < this.minHeight)
                newH = this.minHeight;
            if (newW < this._resizingItem.minWidth)
                newW = this._resizingItem.minWidth;
            if (newH < this._resizingItem.minHeight)
                newH = this._resizingItem.minHeight;
            var calcSize = this._calculateGridSize(newW, newH);
            var itemSize = this._resizingItem.getSize();
            var iGridPos = this._resizingItem.getGridPosition();
            if (!this._isWithinBoundsX(iGridPos, calcSize))
                calcSize.x = (this._maxCols - iGridPos.col) + 1;
            if (!this._isWithinBoundsY(iGridPos, calcSize))
                calcSize.y = (this._maxRows - iGridPos.row) + 1;
            calcSize = this._resizingItem.fixResize(calcSize);
            if (calcSize.x != itemSize.x || calcSize.y != itemSize.y) {
                this._resizingItem.setSize(calcSize, false);
                this._placeholderRef.instance.setSize(calcSize);
                if (['up', 'down', 'left', 'right'].indexOf(this.cascade) >= 0) {
                    this._fixGridCollisions(iGridPos, calcSize, true);
                    this._cascadeGrid(iGridPos, calcSize);
                }
            }
            if (!this._fixToGrid)
                this._resizingItem.setDimensions(newW, newH);
            var bigGrid = this._maxGridSize(itemPos.left + newW + (2 * e.movementX), itemPos.top + newH + (2 * e.movementY));
            if (this._resizeDirection == 'height')
                bigGrid.x = iGridPos.col + itemSize.x;
            if (this._resizeDirection == 'width')
                bigGrid.y = iGridPos.row + itemSize.y;
            this.onResize.emit(this._resizingItem);
            this._resizingItem.onResizeEvent();
        }
    };
    NgGrid.prototype._onMouseUp = function (e) {
        if (this.isDragging) {
            this._dragStop(e);
            return false;
        }
        else if (this.isResizing) {
            this._resizeStop(e);
            return false;
        }
        return true;
    };
    NgGrid.prototype._dragStop = function (e) {
        if (this.isDragging) {
            this.isDragging = false;
            var itemPos = this._draggingItem.getGridPosition();
            this._draggingItem.savePosition(itemPos);
            this._addToGrid(this._draggingItem);
            this._cascadeGrid();
            this._draggingItem.stopMoving();
            this._draggingItem.onDragStopEvent();
            this.onDragStop.emit(this._draggingItem);
            this._draggingItem = null;
            this._posOffset = null;
            this._placeholderRef.destroy();
            this.onItemChange.emit(this._items.map(function (item) { return item.getEventOutput(); }));
            if (this._zoomOnDrag) {
                this._resetZoom();
            }
        }
    };
    NgGrid.prototype._resizeStop = function (e) {
        if (this.isResizing) {
            this.isResizing = false;
            var itemDims = this._resizingItem.getSize();
            this._resizingItem.setSize(itemDims);
            this._addToGrid(this._resizingItem);
            this._cascadeGrid();
            this._resizingItem.stopMoving();
            this._resizingItem.onResizeStopEvent();
            this.onResizeStop.emit(this._resizingItem);
            this._resizingItem = null;
            this._resizeDirection = null;
            this._placeholderRef.destroy();
            this.onItemChange.emit(this._items.map(function (item) { return item.getEventOutput(); }));
        }
    };
    NgGrid.prototype._maxGridSize = function (w, h) {
        var sizex = Math.ceil(w / (this.colWidth + this.marginLeft + this.marginRight));
        var sizey = Math.ceil(h / (this.rowHeight + this.marginTop + this.marginBottom));
        return { 'x': sizex, 'y': sizey };
    };
    NgGrid.prototype._calculateGridSize = function (width, height) {
        width += this.marginLeft + this.marginRight;
        height += this.marginTop + this.marginBottom;
        var sizex = Math.max(this.minCols, Math.round(width / (this.colWidth + this.marginLeft + this.marginRight)));
        var sizey = Math.max(this.minRows, Math.round(height / (this.rowHeight + this.marginTop + this.marginBottom)));
        if (!this._isWithinBoundsX({ col: 1, row: 1 }, { x: sizex, y: sizey }))
            sizex = this._maxCols;
        if (!this._isWithinBoundsY({ col: 1, row: 1 }, { x: sizex, y: sizey }))
            sizey = this._maxRows;
        return { 'x': sizex, 'y': sizey };
    };
    NgGrid.prototype._calculateGridPosition = function (left, top) {
        var col = Math.max(1, Math.round(left / (this.colWidth + this.marginLeft + this.marginRight)) + 1);
        var row = Math.max(1, Math.round(top / (this.rowHeight + this.marginTop + this.marginBottom)) + 1);
        if (!this._isWithinBoundsX({ col: col, row: row }, { x: 1, y: 1 }))
            col = this._maxCols;
        if (!this._isWithinBoundsY({ col: col, row: row }, { x: 1, y: 1 }))
            row = this._maxRows;
        return { 'col': col, 'row': row };
    };
    NgGrid.prototype._hasGridCollision = function (pos, dims) {
        var positions = this._getCollisions(pos, dims);
        if (positions == null || positions.length == 0)
            return false;
        return positions.some(function (v) {
            return !(v === null);
        });
    };
    NgGrid.prototype._getCollisions = function (pos, dims) {
        var returns = [];
        for (var j = 0; j < dims.y; j++) {
            if (this._itemGrid[pos.row + j] != null) {
                for (var i = 0; i < dims.x; i++) {
                    if (this._itemGrid[pos.row + j][pos.col + i] != null) {
                        var item = this._itemGrid[pos.row + j][pos.col + i];
                        if (returns.indexOf(item) < 0)
                            returns.push(item);
                        var itemPos = item.getGridPosition();
                        var itemDims = item.getSize();
                        i = itemPos.col + itemDims.x - pos.col;
                    }
                }
            }
        }
        return returns;
    };
    NgGrid.prototype._fixGridCollisions = function (pos, dims, shouldSave) {
        if (shouldSave === void 0) { shouldSave = false; }
        while (this._hasGridCollision(pos, dims)) {
            var collisions = this._getCollisions(pos, dims);
            this._removeFromGrid(collisions[0]);
            var itemPos = collisions[0].getGridPosition();
            var itemDims = collisions[0].getSize();
            switch (this.cascade) {
                case 'up':
                case 'down':
                default:
                    var oldRow = itemPos.row;
                    itemPos.row = pos.row + dims.y;
                    if (!this._isWithinBoundsY(itemPos, itemDims)) {
                        itemPos.col = pos.col + dims.x;
                        itemPos.row = oldRow;
                    }
                    break;
                case 'left':
                case 'right':
                    var oldCol = itemPos.col;
                    itemPos.col = pos.col + dims.x;
                    if (!this._isWithinBoundsX(itemPos, itemDims)) {
                        itemPos.col = oldCol;
                        itemPos.row = pos.row + dims.y;
                    }
                    break;
            }
            if (shouldSave) {
                collisions[0].savePosition(itemPos);
            }
            else {
                collisions[0].setGridPosition(itemPos);
            }
            this._fixGridCollisions(itemPos, itemDims, shouldSave);
            this._addToGrid(collisions[0]);
            collisions[0].onCascadeEvent();
        }
    };
    NgGrid.prototype._limitGrid = function (maxCols) {
        var items = this._items.slice();
        items.sort(function (a, b) {
            var aPos = a.getSavedPosition();
            var bPos = b.getSavedPosition();
            if (aPos.row == bPos.row) {
                return aPos.col == bPos.col ? 0 : (aPos.col < bPos.col ? -1 : 1);
            }
            else {
                return aPos.row < bPos.row ? -1 : 1;
            }
        });
        var columnMax = {};
        var largestGap = {};
        for (var i = 1; i <= maxCols; i++) {
            columnMax[i] = 1;
            largestGap[i] = 1;
        }
        var curPos = { col: 1, row: 1 };
        var currentRow = 1;
        var willCascade = function (item, col) {
            for (var i = col; i < col + item.sizex; i++) {
                if (columnMax[i] == currentRow)
                    return true;
            }
            return false;
        };
        while (items.length > 0) {
            var columns = [];
            var newBlock = {
                start: 1,
                end: 1,
                length: 0,
            };
            for (var col = 1; col <= maxCols; col++) {
                if (columnMax[col] <= currentRow) {
                    if (newBlock.length == 0) {
                        newBlock.start = col;
                    }
                    newBlock.length++;
                    newBlock.end = col + 1;
                }
                else if (newBlock.length > 0) {
                    columns.push(newBlock);
                    newBlock = {
                        start: col,
                        end: col,
                        length: 0,
                    };
                }
            }
            if (newBlock.length > 0) {
                columns.push(newBlock);
            }
            var tempColumns = columns.map(function (block) { return block.length; });
            var currentItems = [];
            while (items.length > 0) {
                var item = items[0];
                if (item.row > currentRow)
                    break;
                var fits = false;
                for (var x in tempColumns) {
                    if (item.sizex <= tempColumns[x]) {
                        tempColumns[x] -= item.sizex;
                        fits = true;
                        break;
                    }
                    else if (item.sizex > tempColumns[x]) {
                        tempColumns[x] = 0;
                    }
                }
                if (fits) {
                    currentItems.push(items.shift());
                }
                else {
                    break;
                }
            }
            if (currentItems.length > 0) {
                var itemPositions = [];
                var lastPosition = maxCols;
                for (var i = currentItems.length - 1; i >= 0; i--) {
                    var maxPosition = 1;
                    for (var j = columns.length - 1; j >= 0; j--) {
                        if (columns[j].start > lastPosition)
                            continue;
                        if (columns[j].start > (maxCols - currentItems[i].sizex))
                            continue;
                        if (columns[j].length < currentItems[i].sizex)
                            continue;
                        if (lastPosition < columns[j].end && (lastPosition - columns[j].start) < currentItems[i].sizex)
                            continue;
                        maxPosition = (lastPosition < columns[j].end ? lastPosition : columns[j].end) - currentItems[i].sizex;
                        break;
                    }
                    itemPositions[i] = Math.min(maxPosition, currentItems[i].row == currentRow ? currentItems[i].col : 1);
                    lastPosition = itemPositions[i];
                }
                var minPosition = 1;
                var currentItem = 0;
                while (currentItems.length > 0) {
                    var item = currentItems.shift();
                    for (var j = 0; j < columns.length; j++) {
                        if (columns[j].length < item.sizex)
                            continue;
                        if (minPosition > columns[j].end)
                            continue;
                        if (minPosition > columns[j].start && (columns[j].end - minPosition) < item.sizex)
                            continue;
                        if (minPosition < columns[j].start)
                            minPosition = columns[j].start;
                        break;
                    }
                    item.setGridPosition({ col: Math.max(minPosition, itemPositions[currentItem]), row: currentRow });
                    minPosition = item.currentCol + item.sizex;
                    currentItem++;
                    for (var i = item.currentCol; i < item.currentCol + item.sizex; i++) {
                        columnMax[i] = item.currentRow + item.sizey;
                    }
                }
            }
            else if (currentItems.length === 0 && columns.length === 1 && columns[0].length >= maxCols) {
                var item = items.shift();
                item.setGridPosition({ col: 1, row: currentRow });
                for (var i = item.currentCol; i < item.currentCol + item.sizex; i++) {
                    columnMax[i] = item.currentRow + item.sizey;
                }
            }
            var newRow = 0;
            for (var x in columnMax) {
                if (columnMax[x] > currentRow && (newRow == 0 || columnMax[x] < newRow)) {
                    newRow = columnMax[x];
                }
            }
            currentRow = newRow <= currentRow ? currentRow + 1 : newRow;
        }
    };
    NgGrid.prototype._cascadeGrid = function (pos, dims, shouldSave) {
        if (shouldSave === void 0) { shouldSave = true; }
        if (this._destroyed)
            return;
        if (pos && !dims)
            throw new Error('Cannot cascade with only position and not dimensions');
        if (this.isDragging && this._draggingItem && !pos && !dims) {
            pos = this._draggingItem.getGridPosition();
            dims = this._draggingItem.getSize();
        }
        else if (this.isResizing && this._resizingItem && !pos && !dims) {
            pos = this._resizingItem.getGridPosition();
            dims = this._resizingItem.getSize();
        }
        switch (this.cascade) {
            case 'up':
            case 'down':
                var lowRow = [0];
                for (var i = 1; i <= this._curMaxCol; i++)
                    lowRow[i] = 1;
                for (var r = 1; r <= this._curMaxRow; r++) {
                    if (this._itemGrid[r] == undefined)
                        continue;
                    for (var c = 1; c <= this._curMaxCol; c++) {
                        if (this._itemGrid[r] == undefined)
                            break;
                        if (r < lowRow[c])
                            continue;
                        if (this._itemGrid[r][c] != null) {
                            var item = this._itemGrid[r][c];
                            if (item.isFixed)
                                continue;
                            var itemDims = item.getSize();
                            var itemPos = item.getGridPosition();
                            if (itemPos.col != c || itemPos.row != r)
                                continue; //	If this is not the element's start
                            var lowest = lowRow[c];
                            for (var i = 1; i < itemDims.x; i++) {
                                lowest = Math.max(lowRow[(c + i)], lowest);
                            }
                            if (pos && (c + itemDims.x) > pos.col && c < (pos.col + dims.x)) {
                                if ((r >= pos.row && r < (pos.row + dims.y)) ||
                                    ((itemDims.y > (pos.row - lowest)) &&
                                        (r >= (pos.row + dims.y) && lowest < (pos.row + dims.y)))) {
                                    lowest = Math.max(lowest, pos.row + dims.y); //	Set the lowest row to be below it
                                }
                            }
                            var newPos = { col: c, row: lowest };
                            if (lowest != itemPos.row && this._isWithinBoundsY(newPos, itemDims)) {
                                this._removeFromGrid(item);
                                if (shouldSave) {
                                    item.savePosition(newPos);
                                }
                                else {
                                    item.setGridPosition(newPos);
                                }
                                item.onCascadeEvent();
                                this._addToGrid(item);
                            }
                            for (var i = 0; i < itemDims.x; i++) {
                                lowRow[c + i] = lowest + itemDims.y; //	Update the lowest row to be below the item
                            }
                        }
                    }
                }
                break;
            case 'left':
            case 'right':
                var lowCol = [0];
                for (var i = 1; i <= this._curMaxRow; i++)
                    lowCol[i] = 1;
                for (var r = 1; r <= this._curMaxRow; r++) {
                    if (this._itemGrid[r] == undefined)
                        continue;
                    for (var c = 1; c <= this._curMaxCol; c++) {
                        if (this._itemGrid[r] == undefined)
                            break;
                        if (c < lowCol[r])
                            continue;
                        if (this._itemGrid[r][c] != null) {
                            var item = this._itemGrid[r][c];
                            var itemDims = item.getSize();
                            var itemPos = item.getGridPosition();
                            if (itemPos.col != c || itemPos.row != r)
                                continue; //	If this is not the element's start
                            var lowest = lowCol[r];
                            for (var i = 1; i < itemDims.y; i++) {
                                lowest = Math.max(lowCol[(r + i)], lowest);
                            }
                            if (pos && (r + itemDims.y) > pos.row && r < (pos.row + dims.y)) {
                                if ((c >= pos.col && c < (pos.col + dims.x)) ||
                                    ((itemDims.x > (pos.col - lowest)) &&
                                        (c >= (pos.col + dims.x) && lowest < (pos.col + dims.x)))) {
                                    lowest = Math.max(lowest, pos.col + dims.x); //	Set the lowest col to be below it
                                }
                            }
                            var newPos = { col: lowest, row: r };
                            if (lowest != itemPos.col && this._isWithinBoundsX(newPos, itemDims)) {
                                this._removeFromGrid(item);
                                if (shouldSave) {
                                    item.savePosition(newPos);
                                }
                                else {
                                    item.setGridPosition(newPos);
                                }
                                item.onCascadeEvent();
                                this._addToGrid(item);
                            }
                            for (var i = 0; i < itemDims.y; i++) {
                                lowCol[r + i] = lowest + itemDims.x; //	Update the lowest col to be below the item
                            }
                        }
                    }
                }
                break;
            default:
                break;
        }
    };
    NgGrid.prototype._fixGridPosition = function (pos, dims) {
        while (this._hasGridCollision(pos, dims) || !this._isWithinBounds(pos, dims)) {
            if (this._hasGridCollision(pos, dims)) {
                switch (this.cascade) {
                    case 'up':
                    case 'down':
                    default:
                        pos.row++;
                        break;
                    case 'left':
                    case 'right':
                        pos.col++;
                        break;
                }
            }
            if (!this._isWithinBoundsY(pos, dims)) {
                pos.col++;
                pos.row = 1;
            }
            if (!this._isWithinBoundsX(pos, dims)) {
                pos.row++;
                pos.col = 1;
            }
        }
        return pos;
    };
    NgGrid.prototype._isWithinBoundsX = function (pos, dims) {
        return (this._maxCols == 0 || (pos.col + dims.x - 1) <= this._maxCols);
    };
    NgGrid.prototype._isWithinBoundsY = function (pos, dims) {
        return (this._maxRows == 0 || (pos.row + dims.y - 1) <= this._maxRows);
    };
    NgGrid.prototype._isWithinBounds = function (pos, dims) {
        return this._isWithinBoundsX(pos, dims) && this._isWithinBoundsY(pos, dims);
    };
    NgGrid.prototype._addToGrid = function (item) {
        var pos = item.getGridPosition();
        var dims = item.getSize();
        if (this._hasGridCollision(pos, dims)) {
            this._fixGridCollisions(pos, dims);
            pos = item.getGridPosition();
        }
        for (var j = 0; j < dims.y; j++) {
            if (this._itemGrid[pos.row + j] == null)
                this._itemGrid[pos.row + j] = {};
            for (var i = 0; i < dims.x; i++) {
                this._itemGrid[pos.row + j][pos.col + i] = item;
                this._updateSize(pos.col + dims.x - 1, pos.row + dims.y - 1);
            }
        }
    };
    NgGrid.prototype._removeFromGrid = function (item) {
        for (var y in this._itemGrid)
            for (var x in this._itemGrid[y])
                if (this._itemGrid[y][x] == item)
                    delete this._itemGrid[y][x];
    };
    NgGrid.prototype._updateSize = function (col, row) {
        if (this._destroyed)
            return;
        col = (col == undefined) ? this._getMaxCol() : col;
        row = (row == undefined) ? this._getMaxRow() : row;
        var maxCol = Math.max(this._curMaxCol, col);
        var maxRow = Math.max(this._curMaxRow, row);
        if (maxCol != this._curMaxCol || maxRow != this._curMaxRow) {
            this._curMaxCol = maxCol;
            this._curMaxRow = maxRow;
            this._renderer.setElementStyle(this._ngEl.nativeElement, 'width', '100%'); //(maxCol * (this.colWidth + this.marginLeft + this.marginRight))+'px');
            this._renderer.setElementStyle(this._ngEl.nativeElement, 'height', (this._curMaxRow * (this.rowHeight + this.marginTop + this.marginBottom)) + 'px');
        }
    };
    NgGrid.prototype._getMaxRow = function () {
        return Math.max.apply(null, this._items.map(function (item) { return item.getGridPosition().row + item.getSize().y - 1; }));
    };
    NgGrid.prototype._getMaxCol = function () {
        return Math.max.apply(null, this._items.map(function (item) { return item.getGridPosition().col + item.getSize().x - 1; }));
    };
    NgGrid.prototype._getMousePosition = function (e) {
        if ((window.TouchEvent && e instanceof TouchEvent) || (e.touches || e.changedTouches)) {
            e = e.touches.length > 0 ? e.touches[0] : e.changedTouches[0];
        }
        var refPos = this._ngEl.nativeElement.getBoundingClientRect();
        var left = e.clientX - refPos.left;
        var top = e.clientY - refPos.top;
        if (this.cascade == 'down')
            top = refPos.top + refPos.height - e.clientY;
        if (this.cascade == 'right')
            left = refPos.left + refPos.width - e.clientX;
        if (this.isDragging && this._zoomOnDrag) {
            left *= 2;
            top *= 2;
        }
        return {
            left: left,
            top: top
        };
    };
    NgGrid.prototype._getAbsoluteMousePosition = function (e) {
        if ((window.TouchEvent && e instanceof TouchEvent) || (e.touches || e.changedTouches)) {
            e = e.touches.length > 0 ? e.touches[0] : e.changedTouches[0];
        }
        return {
            left: e.clientX,
            top: e.clientY
        };
    };
    NgGrid.prototype._getContainerColumns = function () {
        var maxWidth = this._ngEl.nativeElement.getBoundingClientRect().width;
        return Math.floor(maxWidth / (this.colWidth + this.marginLeft + this.marginRight));
    };
    NgGrid.prototype._getItemFromPosition = function (position) {
        for (var _i = 0, _a = this._items; _i < _a.length; _i++) {
            var item = _a[_i];
            var size = item.getDimensions();
            var pos = item.getPosition();
            if (position.left > (pos.left + this.marginLeft) && position.left < (pos.left + this.marginLeft + size.width) &&
                position.top > (pos.top + this.marginTop) && position.top < (pos.top + this.marginTop + size.height)) {
                return item;
            }
        }
        return null;
    };
    NgGrid.prototype._createPlaceholder = function (item) {
        var pos = item.getGridPosition();
        var dims = item.getSize();
        var factory = this.componentFactoryResolver.resolveComponentFactory(NgGridPlaceholder_1.NgGridPlaceholder);
        var componentRef = item.containerRef.createComponent(factory);
        this._placeholderRef = componentRef;
        var placeholder = componentRef.instance;
        placeholder.registerGrid(this);
        placeholder.setCascadeMode(this.cascade);
        placeholder.setGridPosition({ col: pos.col, row: pos.row });
        placeholder.setSize({ x: dims.x, y: dims.y });
    };
    //	Default config
    NgGrid.CONST_DEFAULT_CONFIG = {
        margins: [10],
        draggable: true,
        resizable: true,
        max_cols: 0,
        max_rows: 0,
        visible_cols: 0,
        visible_rows: 0,
        col_width: 250,
        row_height: 250,
        cascade: 'up',
        min_width: 100,
        min_height: 100,
        fix_to_grid: false,
        auto_style: true,
        auto_resize: false,
        maintain_ratio: false,
        prefer_new: false,
        zoom_on_drag: false
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], NgGrid.prototype, "onDragStart", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], NgGrid.prototype, "onDrag", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], NgGrid.prototype, "onDragStop", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], NgGrid.prototype, "onResizeStart", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], NgGrid.prototype, "onResize", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], NgGrid.prototype, "onResizeStop", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], NgGrid.prototype, "onItemChange", void 0);
    NgGrid = __decorate([
        core_1.Directive({
            selector: '[ngGrid]',
            inputs: ['config: ngGrid'],
            host: {
                '(mousedown)': '_onMouseDown($event)',
                '(mousemove)': '_onMouseMove($event)',
                '(mouseup)': '_onMouseUp($event)',
                '(touchstart)': '_onMouseDown($event)',
                '(touchmove)': '_onMouseMove($event)',
                '(touchend)': '_onMouseUp($event)',
                '(window:resize)': '_onResize($event)',
                '(document:mousemove)': '_onMouseMove($event)',
                '(document:mouseup)': '_onMouseUp($event)'
            },
        }), 
        __metadata('design:paramtypes', [core_1.KeyValueDiffers, core_1.ElementRef, core_1.Renderer, core_1.ComponentFactoryResolver, core_1.ViewContainerRef])
    ], NgGrid);
    return NgGrid;
}());
exports.NgGrid = NgGrid;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRpcmVjdGl2ZXMvTmdHcmlkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxxQkFBdU8sZUFBZSxDQUFDLENBQUE7QUFHdlAsa0NBQWtDLGlDQUFpQyxDQUFDLENBQUE7QUFpQnBFO0lBeUZDLGNBQWM7SUFDZCxnQkFBb0IsUUFBeUIsRUFDbEMsS0FBaUIsRUFDakIsU0FBbUIsRUFDbkIsd0JBQWtELEVBQ2xELGFBQStCO1FBSnRCLGFBQVEsR0FBUixRQUFRLENBQWlCO1FBQ2xDLFVBQUssR0FBTCxLQUFLLENBQVk7UUFDakIsY0FBUyxHQUFULFNBQVMsQ0FBVTtRQUNuQiw2QkFBd0IsR0FBeEIsd0JBQXdCLENBQTBCO1FBQ2xELGtCQUFhLEdBQWIsYUFBYSxDQUFrQjtRQTdGMUMsaUJBQWlCO1FBQ0EsZ0JBQVcsR0FBNkIsSUFBSSxtQkFBWSxFQUFjLENBQUM7UUFDdkUsV0FBTSxHQUE2QixJQUFJLG1CQUFZLEVBQWMsQ0FBQztRQUNsRSxlQUFVLEdBQTZCLElBQUksbUJBQVksRUFBYyxDQUFDO1FBQ3RFLGtCQUFhLEdBQTZCLElBQUksbUJBQVksRUFBYyxDQUFDO1FBQ3pFLGFBQVEsR0FBNkIsSUFBSSxtQkFBWSxFQUFjLENBQUM7UUFDcEUsaUJBQVksR0FBNkIsSUFBSSxtQkFBWSxFQUFjLENBQUM7UUFDeEUsaUJBQVksR0FBeUMsSUFBSSxtQkFBWSxFQUEwQixDQUFDO1FBRWpILG1CQUFtQjtRQUNaLGFBQVEsR0FBVyxHQUFHLENBQUM7UUFDdkIsY0FBUyxHQUFXLEdBQUcsQ0FBQztRQUN4QixZQUFPLEdBQVcsQ0FBQyxDQUFDO1FBQ3BCLFlBQU8sR0FBVyxDQUFDLENBQUM7UUFDcEIsY0FBUyxHQUFXLEVBQUUsQ0FBQztRQUN2QixnQkFBVyxHQUFXLEVBQUUsQ0FBQztRQUN6QixpQkFBWSxHQUFXLEVBQUUsQ0FBQztRQUMxQixlQUFVLEdBQVcsRUFBRSxDQUFDO1FBQ3hCLGVBQVUsR0FBWSxLQUFLLENBQUM7UUFDNUIsZUFBVSxHQUFZLEtBQUssQ0FBQztRQUM1QixjQUFTLEdBQVksSUFBSSxDQUFDO1FBQzFCLGlCQUFZLEdBQVksSUFBSSxDQUFDO1FBQzdCLGVBQVUsR0FBWSxJQUFJLENBQUM7UUFDM0IsWUFBTyxHQUFXLElBQUksQ0FBQztRQUN2QixhQUFRLEdBQVcsR0FBRyxDQUFDO1FBQ3ZCLGNBQVMsR0FBVyxHQUFHLENBQUM7UUFFL0Isb0JBQW9CO1FBQ1osV0FBTSxHQUFzQixFQUFFLENBQUM7UUFDL0Isa0JBQWEsR0FBZSxJQUFJLENBQUM7UUFDakMsa0JBQWEsR0FBZSxJQUFJLENBQUM7UUFDakMscUJBQWdCLEdBQVcsSUFBSSxDQUFDO1FBQ2hDLGNBQVMsR0FBcUQsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQztRQUdqRixhQUFRLEdBQVcsQ0FBQyxDQUFDO1FBQ3JCLGFBQVEsR0FBVyxDQUFDLENBQUM7UUFDckIsaUJBQVksR0FBVyxDQUFDLENBQUM7UUFDekIsaUJBQVksR0FBVyxDQUFDLENBQUM7UUFDekIsY0FBUyxHQUFXLEdBQUcsQ0FBQztRQUN4QixlQUFVLEdBQVcsR0FBRyxDQUFDO1FBQ3pCLGVBQVUsR0FBc0IsSUFBSSxDQUFDO1FBQ3JDLFlBQU8sR0FBWSxLQUFLLENBQUM7UUFDekIsb0JBQWUsR0FBb0MsSUFBSSxDQUFDO1FBQ3hELGVBQVUsR0FBWSxLQUFLLENBQUM7UUFDNUIsZ0JBQVcsR0FBWSxLQUFLLENBQUM7UUFFN0IsZUFBVSxHQUFZLEtBQUssQ0FBQztRQUM1QixtQkFBYyxHQUFZLEtBQUssQ0FBQztRQUVoQyxlQUFVLEdBQVksS0FBSyxDQUFDO1FBQzVCLGdCQUFXLEdBQVksS0FBSyxDQUFDO1FBQzdCLG1CQUFjLEdBQVksS0FBSyxDQUFDO1FBQ2hDLGVBQVUsR0FBVyxDQUFDLENBQUM7UUFDdkIsZUFBVSxHQUFXLENBQUMsQ0FBQztRQXVCdkIsWUFBTyxHQUFHLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQztJQWdCRCxDQUFDO0lBYjlDLHNCQUFJLDBCQUFNO1FBRFYsOEJBQThCO2FBQzlCLFVBQVcsQ0FBZTtZQUN6QixJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRWxCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUN2QyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDOUQsQ0FBQztRQUNGLENBQUM7OztPQUFBO0lBU0QsaUJBQWlCO0lBQ1YseUJBQVEsR0FBZjtRQUNDLElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN2RSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO1lBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUUsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3JHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFTSw0QkFBVyxHQUFsQjtRQUNDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO0lBQ3hCLENBQUM7SUFFTSwwQkFBUyxHQUFoQixVQUFpQixNQUFvQjtRQUNwQyxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUV0QixJQUFJLGdCQUFnQixHQUFHLEtBQUssQ0FBQztRQUM3QixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLElBQUksR0FBRyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwQixJQUFJLE1BQU0sR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRXRDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1gsS0FBSyxTQUFTO29CQUNiLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ3JCLEtBQUssQ0FBQztnQkFDUCxLQUFLLFdBQVc7b0JBQ2YsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDcEMsS0FBSyxDQUFDO2dCQUNQLEtBQUssWUFBWTtvQkFDaEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDckMsS0FBSyxDQUFDO2dCQUNQLEtBQUssWUFBWTtvQkFDaEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxHQUFHLEdBQUcsSUFBSSxHQUFHLEtBQUssQ0FBQztvQkFDcEMsS0FBSyxDQUFDO2dCQUNQLEtBQUssYUFBYTtvQkFDakIsSUFBSSxDQUFDLFdBQVcsR0FBRyxHQUFHLEdBQUcsSUFBSSxHQUFHLEtBQUssQ0FBQztvQkFDdEMsS0FBSyxDQUFDO2dCQUNQLEtBQUssV0FBVztvQkFDZixJQUFJLENBQUMsVUFBVSxHQUFHLEdBQUcsR0FBRyxJQUFJLEdBQUcsS0FBSyxDQUFDO29CQUNyQyxLQUFLLENBQUM7Z0JBQ1AsS0FBSyxXQUFXO29CQUNmLElBQUksQ0FBQyxZQUFZLEdBQUcsR0FBRyxHQUFHLElBQUksR0FBRyxLQUFLLENBQUM7b0JBQ3ZDLEtBQUssQ0FBQztnQkFDUCxLQUFLLFVBQVU7b0JBQ2QsZ0JBQWdCLEdBQUcsZ0JBQWdCLElBQUksSUFBSSxDQUFDLFFBQVEsSUFBSSxNQUFNLENBQUM7b0JBQy9ELElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDO29CQUN4QyxLQUFLLENBQUM7Z0JBQ1AsS0FBSyxVQUFVO29CQUNkLGdCQUFnQixHQUFHLGdCQUFnQixJQUFJLElBQUksQ0FBQyxRQUFRLElBQUksTUFBTSxDQUFDO29CQUMvRCxJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQztvQkFDeEMsS0FBSyxDQUFDO2dCQUNQLEtBQUssY0FBYztvQkFDbEIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDeEMsS0FBSyxDQUFDO2dCQUNQLEtBQUssY0FBYztvQkFDbEIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDeEMsS0FBSyxDQUFDO2dCQUNQLEtBQUssVUFBVTtvQkFDZCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUNuQyxLQUFLLENBQUM7Z0JBQ1AsS0FBSyxVQUFVO29CQUNkLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQ25DLEtBQUssQ0FBQztnQkFDUCxLQUFLLFlBQVk7b0JBQ2hCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQ3JDLEtBQUssQ0FBQztnQkFDUCxLQUFLLFdBQVc7b0JBQ2YsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDcEMsS0FBSyxDQUFDO2dCQUNQLEtBQUssY0FBYztvQkFDbEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxHQUFHLEdBQUcsSUFBSSxHQUFHLEtBQUssQ0FBQztvQkFDdEMsS0FBSyxDQUFDO2dCQUNQLEtBQUssU0FBUztvQkFDYixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0JBQ3pCLElBQUksQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDO3dCQUNuQixJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7b0JBQ3JCLENBQUM7b0JBQ0QsS0FBSyxDQUFDO2dCQUNQLEtBQUssYUFBYTtvQkFDakIsSUFBSSxDQUFDLFVBQVUsR0FBRyxHQUFHLEdBQUcsSUFBSSxHQUFHLEtBQUssQ0FBQztvQkFDckMsS0FBSyxDQUFDO2dCQUNQLEtBQUssZ0JBQWdCO29CQUNwQixJQUFJLENBQUMsY0FBYyxHQUFHLEdBQUcsR0FBRyxJQUFJLEdBQUcsS0FBSyxDQUFDO29CQUN6QyxLQUFLLENBQUM7Z0JBQ1AsS0FBSyxZQUFZO29CQUNoQixJQUFJLENBQUMsVUFBVSxHQUFHLEdBQUcsR0FBRyxJQUFJLEdBQUcsS0FBSyxDQUFDO29CQUNyQyxLQUFLLENBQUM7Z0JBQ1AsS0FBSyxpQkFBaUI7b0JBQ3JCLElBQUksQ0FBQyxjQUFjLEdBQUcsR0FBRyxHQUFHLElBQUksR0FBRyxLQUFLLENBQUM7b0JBQ3pDLEtBQUssQ0FBQztZQUNSLENBQUM7UUFDRixDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7WUFDekIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDckMsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7WUFDcEQsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNQLElBQUksQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDO1lBQzdCLENBQUM7UUFDRixDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDNUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7b0JBQ3RCLEtBQUssTUFBTSxDQUFDO29CQUNaLEtBQUssT0FBTzt3QkFDWCxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQzt3QkFDbEIsS0FBSyxDQUFDO29CQUNQLEtBQUssSUFBSSxDQUFDO29CQUNWLEtBQUssTUFBTSxDQUFDO29CQUNaO3dCQUNDLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO3dCQUNsQixLQUFLLENBQUM7Z0JBQ1IsQ0FBQztZQUNGLENBQUM7WUFFRCxHQUFHLENBQUMsQ0FBYSxVQUFXLEVBQVgsS0FBQSxJQUFJLENBQUMsTUFBTSxFQUFYLGNBQVcsRUFBWCxJQUFXLENBQUM7Z0JBQXhCLElBQUksSUFBSSxTQUFBO2dCQUNaLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztnQkFDakMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO2dCQUUxQixJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUUzQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO29CQUNqRCxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7b0JBQ3ZCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3BCLENBQUM7Z0JBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7b0JBQ3hELElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztvQkFDdkIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDcEIsQ0FBQztnQkFFRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMzRSxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO29CQUNuRCxJQUFJLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUNuQyxDQUFDO2dCQUVELElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDdEI7WUFFRCxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDckIsQ0FBQztRQUVELElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1FBQzNCLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBRTFCLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUM3QyxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7UUFFL0MsRUFBRSxDQUFDLENBQUMsUUFBUSxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztZQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDbkYsRUFBRSxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztZQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7UUFFeEYsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1lBQUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ25ILEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztZQUFDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUV2SCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7WUFBQyxJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztRQUN4RSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7WUFBQyxJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztRQUV4RSxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFFcEIsR0FBRyxDQUFDLENBQWEsVUFBVyxFQUFYLEtBQUEsSUFBSSxDQUFDLE1BQU0sRUFBWCxjQUFXLEVBQVgsSUFBVyxDQUFDO1lBQXhCLElBQUksSUFBSSxTQUFBO1lBQ1osSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMzQixJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUNsQztRQUVELElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUVwQixHQUFHLENBQUMsQ0FBYSxVQUFXLEVBQVgsS0FBQSxJQUFJLENBQUMsTUFBTSxFQUFYLGNBQVcsRUFBWCxJQUFXLENBQUM7WUFBeEIsSUFBSSxJQUFJLFNBQUE7WUFDWixJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDdkIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUN0QjtRQUVELElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUNwQixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDcEIsQ0FBQztJQUVNLGdDQUFlLEdBQXRCLFVBQXVCLEtBQWE7UUFDbkMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsZUFBZSxFQUFFLENBQUM7SUFDN0MsQ0FBQztJQUVNLDRCQUFXLEdBQWxCLFVBQW1CLEtBQWE7UUFDL0IsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDckMsQ0FBQztJQUVNLDBCQUFTLEdBQWhCO1FBQ0MsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQzFCLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUU5QyxFQUFFLENBQUMsQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDckIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFFNUIsTUFBTSxDQUFDLElBQUksQ0FBQztZQUNiLENBQUM7UUFDRixDQUFDO1FBRUQsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUNkLENBQUM7SUFFTSwyQkFBVSxHQUFqQixVQUFrQixPQUFzQjtRQUN2QyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ25ELElBQUksQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUM1RixJQUFJLENBQUMsWUFBWSxHQUFHLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDN0YsSUFBSSxDQUFDLFlBQVksR0FBRyxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQzdGLElBQUksQ0FBQyxVQUFVLEdBQUcsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUM5RixDQUFDO0lBRU0sMkJBQVUsR0FBakI7UUFDQyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztJQUN4QixDQUFDO0lBRU0sNEJBQVcsR0FBbEI7UUFDQyxJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztJQUN6QixDQUFDO0lBRU0sNkJBQVksR0FBbkI7UUFDQyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztJQUMxQixDQUFDO0lBRU0sOEJBQWEsR0FBcEI7UUFDQyxJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztJQUMzQixDQUFDO0lBRU0sd0JBQU8sR0FBZCxVQUFlLE1BQWtCO1FBQ2hDLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3BDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDdEIsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxlQUFlLEVBQUUsRUFBRSxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztZQUMvRSxNQUFNLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzdCLENBQUM7UUFDRCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN6QixJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3hCLE1BQU0sQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUN6QixNQUFNLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDekIsQ0FBQztJQUVNLDJCQUFVLEdBQWpCLFVBQWtCLE1BQWtCO1FBQ25DLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFN0IsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQVcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ3JELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDOUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzFCLENBQUM7UUFDRixDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztZQUFDLE1BQU0sQ0FBQztRQUU1QixJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDcEIsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ25CLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBZ0IsSUFBSyxPQUFBLElBQUksQ0FBQyxlQUFlLEVBQUUsRUFBdEIsQ0FBc0IsQ0FBQyxDQUFDO0lBQ25FLENBQUM7SUFFTSwyQkFBVSxHQUFqQixVQUFrQixNQUFrQjtRQUNuQyxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzdCLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDeEIsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNuQixNQUFNLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDekIsQ0FBQztJQUVNLCtCQUFjLEdBQXJCO1FBQ0MsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFFRCxrQkFBa0I7SUFDVixtQ0FBa0IsR0FBMUI7UUFDQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUN0QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hELElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztnQkFDcEUsSUFBSSxRQUFRLEdBQVcsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxLQUFLLENBQUM7Z0JBRTlFLElBQUksUUFBUSxHQUFXLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxDQUFDO2dCQUN0RCxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztnQkFDakQsRUFBRSxDQUFDLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztvQkFBQyxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztnQkFFM0MsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO29CQUMzRSxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUMxRixDQUFDO1lBQ0YsQ0FBQztRQUNGLENBQUM7SUFDRixDQUFDO0lBRU8sb0NBQW1CLEdBQTNCO1FBQ0MsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDdEIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNoRCxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7Z0JBQ3BFLElBQUksU0FBUyxHQUFXLE1BQU0sQ0FBQyxXQUFXLENBQUM7Z0JBRTNDLElBQUksU0FBUyxHQUFXLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUNsRixTQUFTLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFDbEQsRUFBRSxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztvQkFBQyxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztnQkFFOUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO29CQUM3RSxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUM1RixDQUFDO1lBQ0YsQ0FBQztRQUNGLENBQUM7SUFDRixDQUFDO0lBRU8sNkJBQVksR0FBcEI7UUFDQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO1lBQzdDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxZQUFZLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDakQsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7WUFDcEQsQ0FBQztZQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsWUFBWSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hELElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1lBQ3BELENBQUM7WUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNyRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzNCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO2dCQUNwRCxDQUFDO2dCQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2xDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO2dCQUNwRCxDQUFDO1lBQ0YsQ0FBQztRQUNGLENBQUM7SUFDRixDQUFDO0lBRU8sNkJBQVksR0FBcEI7UUFDQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7WUFDOUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxDQUFDO1FBQzlDLENBQUM7SUFDRixDQUFDO0lBRU8sMEJBQVMsR0FBakIsVUFBa0IsQ0FBTTtRQUN2QixJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUMxQixJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztRQUUzQixJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFFcEIsR0FBRyxDQUFDLENBQWEsVUFBVyxFQUFYLEtBQUEsSUFBSSxDQUFDLE1BQU0sRUFBWCxjQUFXLEVBQVgsSUFBVyxDQUFDO1lBQXhCLElBQUksSUFBSSxTQUFBO1lBQ1osSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUMzQjtRQUVELElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUVwQixHQUFHLENBQUMsQ0FBYSxVQUFXLEVBQVgsS0FBQSxJQUFJLENBQUMsTUFBTSxFQUFYLGNBQVcsRUFBWCxJQUFXLENBQUM7WUFBeEIsSUFBSSxJQUFJLFNBQUE7WUFDWixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3RCLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztTQUN2QjtRQUVELElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUNwQixDQUFDO0lBRU8sOEJBQWEsR0FBckIsVUFBc0IsT0FBWTtRQUFsQyxpQkFNQztRQUxBLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFDLE1BQVcsSUFBTyxLQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0YsT0FBTyxDQUFDLGtCQUFrQixDQUFDLFVBQUMsTUFBVyxJQUFPLEtBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqRyxPQUFPLENBQUMsa0JBQWtCLENBQUMsVUFBQyxNQUFXLElBQU8sT0FBTyxLQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRWxGLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFTyw2QkFBWSxHQUFwQixVQUFxQixDQUFNO1FBQzFCLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6QyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFL0MsRUFBRSxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDbEIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ3BELElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JCLE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDZCxDQUFDO1FBQ0YsQ0FBQztRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDYixDQUFDO0lBRU8sNkJBQVksR0FBcEIsVUFBcUIsQ0FBTTtRQUMxQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztZQUN2QixJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRS9DLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNuQixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztZQUMxQixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMxQyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzNCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM5QixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztZQUV2QixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM5QixJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUMzQixDQUFDO0lBQ0YsQ0FBQztJQUVPLDJCQUFVLEdBQWxCLFVBQW1CLENBQU07UUFDeEIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDckIsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMvQyxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDakMsSUFBSSxPQUFPLEdBQUcsRUFBRSxNQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxRQUFRLENBQUMsR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFBO1lBRTdGLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNuQixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztZQUMxQixJQUFJLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQztZQUMxQixJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzNCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM5QixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztZQUV2QixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM1QixJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztZQUV4QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztnQkFDdEIsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ2pCLENBQUM7UUFDRixDQUFDO0lBQ0YsQ0FBQztJQUVPLHlCQUFRLEdBQWhCO1FBQ0MsSUFBSSxDQUFDLFNBQVMsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUUsV0FBVyxFQUFFLGlCQUFpQixDQUFDLENBQUM7SUFDMUYsQ0FBQztJQUVPLDJCQUFVLEdBQWxCO1FBQ0MsSUFBSSxDQUFDLFNBQVMsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUUsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQzNFLENBQUM7SUFFTyw2QkFBWSxHQUFwQixVQUFxQixDQUFNO1FBQzFCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxVQUFVLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDL0UsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUUvQyxFQUFFLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNyQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNuQixNQUFNLENBQUMsS0FBSyxDQUFDO1lBQ2QsQ0FBQztRQUNGLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUN2QyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25CLENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDOUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyQixDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQzVCLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDZixDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQzVCLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakIsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ1AsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUUvQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNWLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDckIsQ0FBQztRQUNGLENBQUM7UUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2IsQ0FBQztJQUVPLHNCQUFLLEdBQWIsVUFBYyxDQUFNO1FBQ25CLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQ3JCLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6QyxJQUFJLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsRCxJQUFJLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUVoRCxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLGVBQWUsRUFBRSxDQUFDO1lBQ25ELElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDdEQsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUV4QyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ3pDLE9BQU8sQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFFNUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUN6QyxPQUFPLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBRTVDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztnQkFDOUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUM5RCxPQUFPLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDMUQsQ0FBQztZQUNGLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxJQUFJLE9BQU8sQ0FBQyxHQUFHLElBQUksT0FBTyxDQUFDLEdBQUcsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDOUQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDN0QsSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUV2RCxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDaEUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7b0JBQzdDLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUNsQyxDQUFDO1lBQ0YsQ0FBQztZQUNELEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RCLElBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztZQUM1QyxDQUFDO1lBRUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ3JDLElBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDbEMsQ0FBQztJQUNGLENBQUM7SUFFTyx3QkFBTyxHQUFmLFVBQWdCLENBQU07UUFDckIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDckIsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pDLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDL0MsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUNsRCxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsZ0JBQWdCLElBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDcEcsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixJQUFJLE9BQU8sR0FBRyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsUUFBUSxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBRWxHLEVBQUUsQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO2dCQUN4QixJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUN0QixFQUFFLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztnQkFDekIsSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7WUFDdkIsRUFBRSxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDO2dCQUN0QyxJQUFJLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUM7WUFDcEMsRUFBRSxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDO2dCQUN2QyxJQUFJLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUM7WUFFckMsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNuRCxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQzVDLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsZUFBZSxFQUFFLENBQUM7WUFFcEQsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUM5QyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRWpELEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFDOUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUVqRCxRQUFRLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFbEQsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxRQUFRLENBQUMsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxDQUFDLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzFELElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDNUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUVoRCxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDaEUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7b0JBQ2xELElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUN2QyxDQUFDO1lBQ0YsQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztnQkFDcEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBRTlDLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLElBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBRWpILEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsSUFBSSxRQUFRLENBQUM7Z0JBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDN0UsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixJQUFJLE9BQU8sQ0FBQztnQkFBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxHQUFHLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUU1RSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDdkMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUNwQyxDQUFDO0lBQ0YsQ0FBQztJQUVPLDJCQUFVLEdBQWxCLFVBQW1CLENBQU07UUFDeEIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDckIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsQixNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ2QsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUM1QixJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDZCxDQUFDO1FBRUQsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNiLENBQUM7SUFFTywwQkFBUyxHQUFqQixVQUFrQixDQUFNO1FBQ3ZCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQ3JCLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO1lBRXhCLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsZUFBZSxFQUFFLENBQUM7WUFFbkQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDekMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7WUFFcEMsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBRXBCLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDaEMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUNyQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDekMsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7WUFDMUIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7WUFDdkIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUUvQixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFDLElBQWdCLElBQUssT0FBQSxJQUFJLENBQUMsY0FBYyxFQUFFLEVBQXJCLENBQXFCLENBQUMsQ0FBQyxDQUFDO1lBRXJGLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO2dCQUN0QixJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDbkIsQ0FBQztRQUNGLENBQUM7SUFDRixDQUFDO0lBRU8sNEJBQVcsR0FBbkIsVUFBb0IsQ0FBTTtRQUN6QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUNyQixJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztZQUV4QixJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBRTVDLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3JDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBRXBDLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUVwQixJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQ2hDLElBQUksQ0FBQyxhQUFhLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztZQUN2QyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDM0MsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7WUFDMUIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQztZQUM3QixJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBRS9CLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQUMsSUFBZ0IsSUFBSyxPQUFBLElBQUksQ0FBQyxjQUFjLEVBQUUsRUFBckIsQ0FBcUIsQ0FBQyxDQUFDLENBQUM7UUFDdEYsQ0FBQztJQUNGLENBQUM7SUFFTyw2QkFBWSxHQUFwQixVQUFxQixDQUFTLEVBQUUsQ0FBUztRQUN4QyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztRQUNoRixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztRQUNqRixNQUFNLENBQUMsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQztJQUNuQyxDQUFDO0lBRU8sbUNBQWtCLEdBQTFCLFVBQTJCLEtBQWEsRUFBRSxNQUFjO1FBQ3ZELEtBQUssSUFBSSxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7UUFDNUMsTUFBTSxJQUFJLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztRQUU3QyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3RyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUUvRyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztZQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQzlGLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7UUFFOUYsTUFBTSxDQUFDLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLENBQUM7SUFDbkMsQ0FBQztJQUVPLHVDQUFzQixHQUE5QixVQUErQixJQUFZLEVBQUUsR0FBVztRQUN2RCxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNuRyxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUVuRyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQ3hGLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7UUFFeEYsTUFBTSxDQUFDLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLENBQUM7SUFDbkMsQ0FBQztJQUVPLGtDQUFpQixHQUF6QixVQUEwQixHQUF1QixFQUFFLElBQW9CO1FBQ3RFLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRS9DLEVBQUUsQ0FBQyxDQUFDLFNBQVMsSUFBSSxJQUFJLElBQUksU0FBUyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUM7WUFBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBRTdELE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBYTtZQUNuQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQztRQUN0QixDQUFDLENBQUMsQ0FBQztJQUNKLENBQUM7SUFFTywrQkFBYyxHQUF0QixVQUF1QixHQUF1QixFQUFFLElBQW9CO1FBQ25FLElBQU0sT0FBTyxHQUFzQixFQUFFLENBQUM7UUFFdEMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQVcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDekMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ3pDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFXLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO29CQUN6QyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO3dCQUN0RCxJQUFNLElBQUksR0FBZSxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQzt3QkFFbEUsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7NEJBQzdCLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7d0JBRXBCLElBQU0sT0FBTyxHQUF1QixJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7d0JBQzNELElBQU0sUUFBUSxHQUFtQixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7d0JBRWhELENBQUMsR0FBRyxPQUFPLENBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQztvQkFDeEMsQ0FBQztnQkFDRixDQUFDO1lBQ0YsQ0FBQztRQUNGLENBQUM7UUFFRCxNQUFNLENBQUMsT0FBTyxDQUFDO0lBQ2hCLENBQUM7SUFFTyxtQ0FBa0IsR0FBMUIsVUFBMkIsR0FBdUIsRUFBRSxJQUFvQixFQUFFLFVBQTJCO1FBQTNCLDBCQUEyQixHQUEzQixrQkFBMkI7UUFDcEcsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUM7WUFDMUMsSUFBTSxVQUFVLEdBQXNCLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBRXJFLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFcEMsSUFBTSxPQUFPLEdBQXVCLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUNwRSxJQUFNLFFBQVEsR0FBbUIsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBRXpELE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUN0QixLQUFLLElBQUksQ0FBQztnQkFDVixLQUFLLE1BQU0sQ0FBQztnQkFDWjtvQkFDQyxJQUFNLE1BQU0sR0FBVyxPQUFPLENBQUMsR0FBRyxDQUFDO29CQUNuQyxPQUFPLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFFL0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDL0MsT0FBTyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7d0JBQy9CLE9BQU8sQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDO29CQUN0QixDQUFDO29CQUNELEtBQUssQ0FBQztnQkFDUCxLQUFLLE1BQU0sQ0FBQztnQkFDWixLQUFLLE9BQU87b0JBQ1gsSUFBTSxNQUFNLEdBQVcsT0FBTyxDQUFDLEdBQUcsQ0FBQztvQkFDbkMsT0FBTyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBRS9CLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQy9DLE9BQU8sQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDO3dCQUNyQixPQUFPLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDaEMsQ0FBQztvQkFDRCxLQUFLLENBQUM7WUFDUixDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFDaEIsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNyQyxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ1AsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN4QyxDQUFDO1lBRUQsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFDdkQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMvQixVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDaEMsQ0FBQztJQUNGLENBQUM7SUFFTywyQkFBVSxHQUFsQixVQUFtQixPQUFlO1FBQ2pDLElBQU0sS0FBSyxHQUFzQixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRXJELEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBQyxDQUFhLEVBQUUsQ0FBYTtZQUN2QyxJQUFJLElBQUksR0FBdUIsQ0FBQyxDQUFDLGdCQUFnQixFQUFFLENBQUM7WUFDcEQsSUFBSSxJQUFJLEdBQXVCLENBQUMsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1lBRXBELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQzFCLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ2xFLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDUCxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNyQyxDQUFDO1FBQ0YsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFNLFNBQVMsR0FBOEIsRUFBRSxDQUFDO1FBQ2hELElBQU0sVUFBVSxHQUE4QixFQUFFLENBQUM7UUFFakQsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQVcsQ0FBQyxFQUFFLENBQUMsSUFBSSxPQUFPLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUMzQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2pCLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbkIsQ0FBQztRQUVELElBQU0sTUFBTSxHQUF1QixFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDO1FBQ3RELElBQUksVUFBVSxHQUFXLENBQUMsQ0FBQztRQUUzQixJQUFNLFdBQVcsR0FBK0MsVUFBQyxJQUFnQixFQUFFLEdBQVc7WUFDN0YsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQVcsR0FBRyxFQUFFLENBQUMsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUNyRCxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksVUFBVSxDQUFDO29CQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDN0MsQ0FBQztZQUVELE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDZCxDQUFDLENBQUM7UUFRRixPQUFPLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUM7WUFDekIsSUFBTSxPQUFPLEdBQXFCLEVBQUUsQ0FBQztZQUNyQyxJQUFJLFFBQVEsR0FBYztnQkFDekIsS0FBSyxFQUFFLENBQUM7Z0JBQ1IsR0FBRyxFQUFFLENBQUM7Z0JBQ04sTUFBTSxFQUFFLENBQUM7YUFDVCxDQUFDO1lBRUYsR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLEdBQVcsQ0FBQyxFQUFFLEdBQUcsSUFBSSxPQUFPLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQztnQkFDakQsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUM7b0JBQ2xDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDMUIsUUFBUSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7b0JBQ3RCLENBQUM7b0JBRUQsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDO29CQUNsQixRQUFRLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7Z0JBQ3hCLENBQUM7Z0JBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDaEMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFFdkIsUUFBUSxHQUFHO3dCQUNWLEtBQUssRUFBRSxHQUFHO3dCQUNWLEdBQUcsRUFBRSxHQUFHO3dCQUNSLE1BQU0sRUFBRSxDQUFDO3FCQUNULENBQUM7Z0JBQ0gsQ0FBQztZQUNGLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pCLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDeEIsQ0FBQztZQUVELElBQUksV0FBVyxHQUFrQixPQUFPLENBQUMsR0FBRyxDQUFDLFVBQUMsS0FBZ0IsSUFBSyxPQUFBLEtBQUssQ0FBQyxNQUFNLEVBQVosQ0FBWSxDQUFDLENBQUM7WUFDakYsSUFBTSxZQUFZLEdBQXNCLEVBQUUsQ0FBQztZQUUzQyxPQUFPLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUM7Z0JBQ3pCLElBQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFFdEIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxVQUFVLENBQUM7b0JBQUMsS0FBSyxDQUFDO2dCQUVqQyxJQUFJLElBQUksR0FBWSxLQUFLLENBQUM7Z0JBQzFCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUM7b0JBQzNCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDbEMsV0FBVyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUM7d0JBQzdCLElBQUksR0FBRyxJQUFJLENBQUM7d0JBQ1osS0FBSyxDQUFDO29CQUNQLENBQUM7b0JBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDeEMsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDcEIsQ0FBQztnQkFDRixDQUFDO2dCQUVELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQ1YsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztnQkFDbEMsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDUCxLQUFLLENBQUM7Z0JBQ1AsQ0FBQztZQUNGLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzdCLElBQU0sYUFBYSxHQUFrQixFQUFFLENBQUM7Z0JBQ3hDLElBQUksWUFBWSxHQUFXLE9BQU8sQ0FBQztnQkFFbkMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsWUFBWSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO29CQUNuRCxJQUFJLFdBQVcsR0FBRyxDQUFDLENBQUM7b0JBRXBCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQzt3QkFDOUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxZQUFZLENBQUM7NEJBQUMsUUFBUSxDQUFDO3dCQUM5QyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsT0FBTyxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQzs0QkFBQyxRQUFRLENBQUM7d0JBQ25FLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQzs0QkFBQyxRQUFRLENBQUM7d0JBQ3hELEVBQUUsQ0FBQyxDQUFDLFlBQVksR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsWUFBWSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDOzRCQUFDLFFBQVEsQ0FBQzt3QkFFekcsV0FBVyxHQUFHLENBQUMsWUFBWSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsWUFBWSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFBO3dCQUNyRyxLQUFLLENBQUM7b0JBQ1AsQ0FBQztvQkFFRCxhQUFhLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxVQUFVLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDdEcsWUFBWSxHQUFHLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDakMsQ0FBQztnQkFFRCxJQUFJLFdBQVcsR0FBVyxDQUFDLENBQUM7Z0JBQzVCLElBQUksV0FBVyxHQUFXLENBQUMsQ0FBQztnQkFFNUIsT0FBTyxZQUFZLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDO29CQUNoQyxJQUFNLElBQUksR0FBZSxZQUFZLENBQUMsS0FBSyxFQUFFLENBQUM7b0JBRTlDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO3dCQUN6QyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7NEJBQUMsUUFBUSxDQUFDO3dCQUM3QyxFQUFFLENBQUMsQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQzs0QkFBQyxRQUFRLENBQUM7d0JBQzNDLEVBQUUsQ0FBQyxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxXQUFXLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDOzRCQUFDLFFBQVEsQ0FBQzt3QkFDNUYsRUFBRSxDQUFDLENBQUMsV0FBVyxHQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7NEJBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7d0JBQ3BFLEtBQUssQ0FBQztvQkFDUCxDQUFDO29CQUVELElBQUksQ0FBQyxlQUFlLENBQUMsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUM7b0JBRWxHLFdBQVcsR0FBRyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7b0JBQzNDLFdBQVcsRUFBRSxDQUFDO29CQUVkLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFXLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO3dCQUM3RSxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO29CQUM3QyxDQUFDO2dCQUNGLENBQUM7WUFDRixDQUFDO1lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDOUYsSUFBTSxJQUFJLEdBQWUsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUV2QyxJQUFJLENBQUMsZUFBZSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQztnQkFFbEQsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQVcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7b0JBQzdFLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7Z0JBQzdDLENBQUM7WUFDRixDQUFDO1lBRUQsSUFBSSxNQUFNLEdBQVcsQ0FBQyxDQUFDO1lBRXZCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pCLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3pFLE1BQU0sR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZCLENBQUM7WUFDRixDQUFDO1lBRUQsVUFBVSxHQUFHLE1BQU0sSUFBSSxVQUFVLEdBQUcsVUFBVSxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUM7UUFDN0QsQ0FBQztJQUNGLENBQUM7SUFFTyw2QkFBWSxHQUFwQixVQUFxQixHQUF3QixFQUFFLElBQXFCLEVBQUUsVUFBMEI7UUFBMUIsMEJBQTBCLEdBQTFCLGlCQUEwQjtRQUMvRixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO1lBQUMsTUFBTSxDQUFDO1FBQzVCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztZQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsc0RBQXNELENBQUMsQ0FBQztRQUUxRixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxhQUFhLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQzVELEdBQUcsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLGVBQWUsRUFBRSxDQUFDO1lBQzNDLElBQUksR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3JDLENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsYUFBYSxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNuRSxHQUFHLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUMzQyxJQUFJLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNyQyxDQUFDO1FBRUQsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDdEIsS0FBSyxJQUFJLENBQUM7WUFDVixLQUFLLE1BQU07Z0JBQ1YsSUFBTSxNQUFNLEdBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRWxDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFXLENBQUMsRUFBRSxDQUFDLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLEVBQUU7b0JBQ2hELE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBRWYsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQVcsQ0FBQyxFQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7b0JBQ25ELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksU0FBUyxDQUFDO3dCQUFDLFFBQVEsQ0FBQztvQkFFN0MsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQVcsQ0FBQyxFQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7d0JBQ25ELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksU0FBUyxDQUFDOzRCQUFDLEtBQUssQ0FBQzt3QkFDMUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFBQyxRQUFRLENBQUM7d0JBRTVCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQzs0QkFDbEMsSUFBTSxJQUFJLEdBQWUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDOUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztnQ0FBQyxRQUFRLENBQUM7NEJBRTNCLElBQU0sUUFBUSxHQUFtQixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7NEJBQ2hELElBQU0sT0FBTyxHQUF1QixJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7NEJBRTNELEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLE9BQU8sQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO2dDQUFDLFFBQVEsQ0FBQyxDQUFDLHFDQUFxQzs0QkFFekYsSUFBSSxNQUFNLEdBQVcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUUvQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBVyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQ0FDN0MsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7NEJBQzVDLENBQUM7NEJBRUQsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQ0FDakUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQ0FDM0MsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxDQUFDO3dDQUNqQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0NBQzdELE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUF3QixvQ0FBb0M7Z0NBQ3pHLENBQUM7NEJBQ0YsQ0FBQzs0QkFFRCxJQUFNLE1BQU0sR0FBdUIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsQ0FBQzs0QkFFM0QsRUFBRSxDQUFDLENBQUMsTUFBTSxJQUFJLE9BQU8sQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0NBQ3RFLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7Z0NBRTNCLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7b0NBQ2hCLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7Z0NBQzNCLENBQUM7Z0NBQUMsSUFBSSxDQUFDLENBQUM7b0NBQ1AsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQ0FDOUIsQ0FBQztnQ0FFRCxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7Z0NBQ3RCLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7NEJBQ3ZCLENBQUM7NEJBRUQsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQVcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0NBQzdDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsTUFBTSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyw2Q0FBNkM7NEJBQ25GLENBQUM7d0JBQ0YsQ0FBQztvQkFDRixDQUFDO2dCQUNGLENBQUM7Z0JBQ0QsS0FBSyxDQUFDO1lBQ1AsS0FBSyxNQUFNLENBQUM7WUFDWixLQUFLLE9BQU87Z0JBQ1gsSUFBTSxNQUFNLEdBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRWxDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFXLENBQUMsRUFBRSxDQUFDLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLEVBQUU7b0JBQ2hELE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBRWYsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQVcsQ0FBQyxFQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7b0JBQ25ELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksU0FBUyxDQUFDO3dCQUFDLFFBQVEsQ0FBQztvQkFFN0MsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQVcsQ0FBQyxFQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7d0JBQ25ELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksU0FBUyxDQUFDOzRCQUFDLEtBQUssQ0FBQzt3QkFDMUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFBQyxRQUFRLENBQUM7d0JBRTVCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQzs0QkFDbEMsSUFBTSxJQUFJLEdBQWUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDOUMsSUFBTSxRQUFRLEdBQW1CLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQzs0QkFDaEQsSUFBTSxPQUFPLEdBQXVCLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQzs0QkFFM0QsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksT0FBTyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7Z0NBQUMsUUFBUSxDQUFDLENBQUMscUNBQXFDOzRCQUV6RixJQUFJLE1BQU0sR0FBVyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBRS9CLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFXLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dDQUM3QyxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQzs0QkFDNUMsQ0FBQzs0QkFFRCxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dDQUNqRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO29DQUMzQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDLENBQUM7d0NBQ2pDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksTUFBTSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQ0FDN0QsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQXdCLG9DQUFvQztnQ0FDekcsQ0FBQzs0QkFDRixDQUFDOzRCQUVELElBQU0sTUFBTSxHQUF1QixFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDOzRCQUUzRCxFQUFFLENBQUMsQ0FBQyxNQUFNLElBQUksT0FBTyxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQ0FDdEUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQ0FFM0IsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztvQ0FDaEIsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztnQ0FDM0IsQ0FBQztnQ0FBQyxJQUFJLENBQUMsQ0FBQztvQ0FDUCxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dDQUM5QixDQUFDO2dDQUVELElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztnQ0FDdEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQzs0QkFDdkIsQ0FBQzs0QkFFRCxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBVyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQ0FDN0MsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxNQUFNLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLDZDQUE2Qzs0QkFDbkYsQ0FBQzt3QkFDRixDQUFDO29CQUNGLENBQUM7Z0JBQ0YsQ0FBQztnQkFDRCxLQUFLLENBQUM7WUFDUDtnQkFDQyxLQUFLLENBQUM7UUFDUixDQUFDO0lBQ0YsQ0FBQztJQUVPLGlDQUFnQixHQUF4QixVQUF5QixHQUF1QixFQUFFLElBQW9CO1FBQ3JFLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUM7WUFDOUUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO29CQUN0QixLQUFLLElBQUksQ0FBQztvQkFDVixLQUFLLE1BQU0sQ0FBQztvQkFDWjt3QkFDQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7d0JBQ1YsS0FBSyxDQUFDO29CQUNQLEtBQUssTUFBTSxDQUFDO29CQUNaLEtBQUssT0FBTzt3QkFDWCxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7d0JBQ1YsS0FBSyxDQUFDO2dCQUNSLENBQUM7WUFDRixDQUFDO1lBR0QsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdkMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO2dCQUNWLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztZQUNELEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztnQkFDVixHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztZQUNiLENBQUM7UUFDRixDQUFDO1FBQ0QsTUFBTSxDQUFDLEdBQUcsQ0FBQztJQUNaLENBQUM7SUFFTyxpQ0FBZ0IsR0FBeEIsVUFBeUIsR0FBdUIsRUFBRSxJQUFvQjtRQUNyRSxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDeEUsQ0FBQztJQUNPLGlDQUFnQixHQUF4QixVQUF5QixHQUF1QixFQUFFLElBQW9CO1FBQ3JFLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN4RSxDQUFDO0lBQ08sZ0NBQWUsR0FBdkIsVUFBd0IsR0FBdUIsRUFBRSxJQUFvQjtRQUNwRSxNQUFNLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzdFLENBQUM7SUFFTywyQkFBVSxHQUFsQixVQUFtQixJQUFnQjtRQUNsQyxJQUFJLEdBQUcsR0FBdUIsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQ3JELElBQU0sSUFBSSxHQUFtQixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFFNUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdkMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNuQyxHQUFHLEdBQUcsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQzlCLENBQUM7UUFFRCxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBVyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUN6QyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDO2dCQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7WUFFMUUsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQVcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQ3pDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztnQkFFaEQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUM5RCxDQUFDO1FBQ0YsQ0FBQztJQUNGLENBQUM7SUFFTyxnQ0FBZSxHQUF2QixVQUF3QixJQUFnQjtRQUN2QyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDO1lBQzVCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQy9CLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDO29CQUNoQyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVPLDRCQUFXLEdBQW5CLFVBQW9CLEdBQVksRUFBRSxHQUFZO1FBQzdDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7WUFBQyxNQUFNLENBQUM7UUFDNUIsR0FBRyxHQUFHLENBQUMsR0FBRyxJQUFJLFNBQVMsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsR0FBRyxHQUFHLENBQUM7UUFDbkQsR0FBRyxHQUFHLENBQUMsR0FBRyxJQUFJLFNBQVMsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsR0FBRyxHQUFHLENBQUM7UUFFbkQsSUFBSSxNQUFNLEdBQVcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3BELElBQUksTUFBTSxHQUFXLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUVwRCxFQUFFLENBQUMsQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLFVBQVUsSUFBSSxNQUFNLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDNUQsSUFBSSxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUM7WUFDekIsSUFBSSxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUM7WUFFekIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUEsd0VBQXdFO1lBQ2xKLElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFFLFFBQVEsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFDdEosQ0FBQztJQUNGLENBQUM7SUFFTywyQkFBVSxHQUFsQjtRQUNDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBQyxJQUFnQixJQUFLLE9BQUEsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBakQsQ0FBaUQsQ0FBQyxDQUFDLENBQUM7SUFDdkgsQ0FBQztJQUVPLDJCQUFVLEdBQWxCO1FBQ0MsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFDLElBQWdCLElBQUssT0FBQSxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFqRCxDQUFpRCxDQUFDLENBQUMsQ0FBQztJQUN2SCxDQUFDO0lBRU8sa0NBQWlCLEdBQXpCLFVBQTBCLENBQU07UUFDL0IsRUFBRSxDQUFDLENBQUMsQ0FBTyxNQUFPLENBQUMsVUFBVSxJQUFJLENBQUMsWUFBWSxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM5RixDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMvRCxDQUFDO1FBRUQsSUFBTSxNQUFNLEdBQVEsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMscUJBQXFCLEVBQUUsQ0FBQztRQUVyRSxJQUFJLElBQUksR0FBVyxDQUFDLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDM0MsSUFBSSxHQUFHLEdBQVcsQ0FBQyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDO1FBRXpDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksTUFBTSxDQUFDO1lBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDO1FBQ3pFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDO1lBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDO1FBRTNFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDekMsSUFBSSxJQUFJLENBQUMsQ0FBQztZQUNWLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFDVixDQUFDO1FBRUQsTUFBTSxDQUFDO1lBQ04sSUFBSSxFQUFFLElBQUk7WUFDVixHQUFHLEVBQUUsR0FBRztTQUNSLENBQUM7SUFDSCxDQUFDO0lBRU8sMENBQXlCLEdBQWpDLFVBQWtDLENBQU07UUFDdkMsRUFBRSxDQUFDLENBQUMsQ0FBTyxNQUFPLENBQUMsVUFBVSxJQUFJLENBQUMsWUFBWSxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM5RixDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMvRCxDQUFDO1FBRUQsTUFBTSxDQUFDO1lBQ04sSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPO1lBQ2YsR0FBRyxFQUFFLENBQUMsQ0FBQyxPQUFPO1NBQ2QsQ0FBQztJQUNILENBQUM7SUFFTyxxQ0FBb0IsR0FBNUI7UUFDQyxJQUFNLFFBQVEsR0FBVyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLEtBQUssQ0FBQztRQUNoRixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7SUFDcEYsQ0FBQztJQUVPLHFDQUFvQixHQUE1QixVQUE2QixRQUEyQjtRQUN2RCxHQUFHLENBQUMsQ0FBYSxVQUFXLEVBQVgsS0FBQSxJQUFJLENBQUMsTUFBTSxFQUFYLGNBQVcsRUFBWCxJQUFXLENBQUM7WUFBeEIsSUFBSSxJQUFJLFNBQUE7WUFDWixJQUFNLElBQUksR0FBeUIsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQ3hELElBQU0sR0FBRyxHQUFzQixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7WUFFbEQsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztnQkFDNUcsUUFBUSxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdkcsTUFBTSxDQUFDLElBQUksQ0FBQztZQUNiLENBQUM7U0FDRDtRQUVELE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDYixDQUFDO0lBRU8sbUNBQWtCLEdBQTFCLFVBQTJCLElBQWdCO1FBQzFDLElBQU0sR0FBRyxHQUF1QixJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDdkQsSUFBTSxJQUFJLEdBQW1CLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUV0QyxJQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsd0JBQXdCLENBQUMsdUJBQXVCLENBQUMscUNBQWlCLENBQUMsQ0FBQztRQUN6RixJQUFJLFlBQVksR0FBb0MsSUFBSSxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDL0YsSUFBSSxDQUFDLGVBQWUsR0FBRyxZQUFZLENBQUM7UUFDcEMsSUFBTSxXQUFXLEdBQXNCLFlBQVksQ0FBQyxRQUFRLENBQUM7UUFDN0QsV0FBVyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMvQixXQUFXLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN6QyxXQUFXLENBQUMsZUFBZSxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQzVELFdBQVcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDckQsQ0FBQztJQW5xQ0QsaUJBQWlCO0lBQ0YsMkJBQW9CLEdBQWlCO1FBQ25ELE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQztRQUNiLFNBQVMsRUFBRSxJQUFJO1FBQ2YsU0FBUyxFQUFFLElBQUk7UUFDZixRQUFRLEVBQUUsQ0FBQztRQUNYLFFBQVEsRUFBRSxDQUFDO1FBQ1gsWUFBWSxFQUFFLENBQUM7UUFDZixZQUFZLEVBQUUsQ0FBQztRQUNmLFNBQVMsRUFBRSxHQUFHO1FBQ2QsVUFBVSxFQUFFLEdBQUc7UUFDZixPQUFPLEVBQUUsSUFBSTtRQUNiLFNBQVMsRUFBRSxHQUFHO1FBQ2QsVUFBVSxFQUFFLEdBQUc7UUFDZixXQUFXLEVBQUUsS0FBSztRQUNsQixVQUFVLEVBQUUsSUFBSTtRQUNoQixXQUFXLEVBQUUsS0FBSztRQUNsQixjQUFjLEVBQUUsS0FBSztRQUNyQixVQUFVLEVBQUUsS0FBSztRQUNqQixZQUFZLEVBQUUsS0FBSztLQUNuQixDQUFDO0lBM0VGO1FBQUMsYUFBTSxFQUFFOzsrQ0FBQTtJQUNUO1FBQUMsYUFBTSxFQUFFOzswQ0FBQTtJQUNUO1FBQUMsYUFBTSxFQUFFOzs4Q0FBQTtJQUNUO1FBQUMsYUFBTSxFQUFFOztpREFBQTtJQUNUO1FBQUMsYUFBTSxFQUFFOzs0Q0FBQTtJQUNUO1FBQUMsYUFBTSxFQUFFOztnREFBQTtJQUNUO1FBQUMsYUFBTSxFQUFFOztnREFBQTtJQXZCVjtRQUFDLGdCQUFTLENBQUM7WUFDVixRQUFRLEVBQUUsVUFBVTtZQUNwQixNQUFNLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQztZQUMxQixJQUFJLEVBQUU7Z0JBQ0wsYUFBYSxFQUFFLHNCQUFzQjtnQkFDckMsYUFBYSxFQUFFLHNCQUFzQjtnQkFDckMsV0FBVyxFQUFFLG9CQUFvQjtnQkFDakMsY0FBYyxFQUFFLHNCQUFzQjtnQkFDdEMsYUFBYSxFQUFFLHNCQUFzQjtnQkFDckMsWUFBWSxFQUFFLG9CQUFvQjtnQkFDbEMsaUJBQWlCLEVBQUUsbUJBQW1CO2dCQUN0QyxzQkFBc0IsRUFBRSxzQkFBc0I7Z0JBQzlDLG9CQUFvQixFQUFFLG9CQUFvQjthQUMxQztTQUNELENBQUM7O2NBQUE7SUE4dENGLGFBQUM7QUFBRCxDQTd0Q0EsQUE2dENDLElBQUE7QUE3dENZLGNBQU0sU0E2dENsQixDQUFBIiwiZmlsZSI6ImRpcmVjdGl2ZXMvTmdHcmlkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIFJlbmRlcmVyLCBFdmVudEVtaXR0ZXIsIENvbXBvbmVudEZhY3RvcnlSZXNvbHZlciwgSG9zdCwgVmlld0VuY2Fwc3VsYXRpb24sIFR5cGUsIENvbXBvbmVudFJlZiwgS2V5VmFsdWVEaWZmZXIsIEtleVZhbHVlRGlmZmVycywgT25Jbml0LCBPbkRlc3Ryb3ksIERvQ2hlY2ssIFZpZXdDb250YWluZXJSZWYsIE91dHB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBOZ0dyaWRDb25maWcsIE5nR3JpZEl0ZW1FdmVudCwgTmdHcmlkSXRlbVBvc2l0aW9uLCBOZ0dyaWRJdGVtU2l6ZSwgTmdHcmlkUmF3UG9zaXRpb24sIE5nR3JpZEl0ZW1EaW1lbnNpb25zIH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9JTmdHcmlkJztcclxuaW1wb3J0IHsgTmdHcmlkSXRlbSB9IGZyb20gJy4vTmdHcmlkSXRlbSc7XHJcbmltcG9ydCB7IE5nR3JpZFBsYWNlaG9sZGVyIH0gZnJvbSAnLi4vY29tcG9uZW50cy9OZ0dyaWRQbGFjZWhvbGRlcic7XHJcblxyXG5ARGlyZWN0aXZlKHtcclxuXHRzZWxlY3RvcjogJ1tuZ0dyaWRdJyxcclxuXHRpbnB1dHM6IFsnY29uZmlnOiBuZ0dyaWQnXSxcclxuXHRob3N0OiB7XHJcblx0XHQnKG1vdXNlZG93biknOiAnX29uTW91c2VEb3duKCRldmVudCknLFxyXG5cdFx0Jyhtb3VzZW1vdmUpJzogJ19vbk1vdXNlTW92ZSgkZXZlbnQpJyxcclxuXHRcdCcobW91c2V1cCknOiAnX29uTW91c2VVcCgkZXZlbnQpJyxcclxuXHRcdCcodG91Y2hzdGFydCknOiAnX29uTW91c2VEb3duKCRldmVudCknLFxyXG5cdFx0Jyh0b3VjaG1vdmUpJzogJ19vbk1vdXNlTW92ZSgkZXZlbnQpJyxcclxuXHRcdCcodG91Y2hlbmQpJzogJ19vbk1vdXNlVXAoJGV2ZW50KScsXHJcblx0XHQnKHdpbmRvdzpyZXNpemUpJzogJ19vblJlc2l6ZSgkZXZlbnQpJyxcclxuXHRcdCcoZG9jdW1lbnQ6bW91c2Vtb3ZlKSc6ICdfb25Nb3VzZU1vdmUoJGV2ZW50KScsXHJcblx0XHQnKGRvY3VtZW50Om1vdXNldXApJzogJ19vbk1vdXNlVXAoJGV2ZW50KSdcclxuXHR9LFxyXG59KVxyXG5leHBvcnQgY2xhc3MgTmdHcmlkIGltcGxlbWVudHMgT25Jbml0LCBEb0NoZWNrLCBPbkRlc3Ryb3kge1xyXG5cdC8vXHRFdmVudCBFbWl0dGVyc1xyXG5cdEBPdXRwdXQoKSBwdWJsaWMgb25EcmFnU3RhcnQ6IEV2ZW50RW1pdHRlcjxOZ0dyaWRJdGVtPiA9IG5ldyBFdmVudEVtaXR0ZXI8TmdHcmlkSXRlbT4oKTtcclxuXHRAT3V0cHV0KCkgcHVibGljIG9uRHJhZzogRXZlbnRFbWl0dGVyPE5nR3JpZEl0ZW0+ID0gbmV3IEV2ZW50RW1pdHRlcjxOZ0dyaWRJdGVtPigpO1xyXG5cdEBPdXRwdXQoKSBwdWJsaWMgb25EcmFnU3RvcDogRXZlbnRFbWl0dGVyPE5nR3JpZEl0ZW0+ID0gbmV3IEV2ZW50RW1pdHRlcjxOZ0dyaWRJdGVtPigpO1xyXG5cdEBPdXRwdXQoKSBwdWJsaWMgb25SZXNpemVTdGFydDogRXZlbnRFbWl0dGVyPE5nR3JpZEl0ZW0+ID0gbmV3IEV2ZW50RW1pdHRlcjxOZ0dyaWRJdGVtPigpO1xyXG5cdEBPdXRwdXQoKSBwdWJsaWMgb25SZXNpemU6IEV2ZW50RW1pdHRlcjxOZ0dyaWRJdGVtPiA9IG5ldyBFdmVudEVtaXR0ZXI8TmdHcmlkSXRlbT4oKTtcclxuXHRAT3V0cHV0KCkgcHVibGljIG9uUmVzaXplU3RvcDogRXZlbnRFbWl0dGVyPE5nR3JpZEl0ZW0+ID0gbmV3IEV2ZW50RW1pdHRlcjxOZ0dyaWRJdGVtPigpO1xyXG5cdEBPdXRwdXQoKSBwdWJsaWMgb25JdGVtQ2hhbmdlOiBFdmVudEVtaXR0ZXI8QXJyYXk8TmdHcmlkSXRlbUV2ZW50Pj4gPSBuZXcgRXZlbnRFbWl0dGVyPEFycmF5PE5nR3JpZEl0ZW1FdmVudD4+KCk7XHJcblxyXG5cdC8vXHRQdWJsaWMgdmFyaWFibGVzXHJcblx0cHVibGljIGNvbFdpZHRoOiBudW1iZXIgPSAyNTA7XHJcblx0cHVibGljIHJvd0hlaWdodDogbnVtYmVyID0gMjUwO1xyXG5cdHB1YmxpYyBtaW5Db2xzOiBudW1iZXIgPSAxO1xyXG5cdHB1YmxpYyBtaW5Sb3dzOiBudW1iZXIgPSAxO1xyXG5cdHB1YmxpYyBtYXJnaW5Ub3A6IG51bWJlciA9IDEwO1xyXG5cdHB1YmxpYyBtYXJnaW5SaWdodDogbnVtYmVyID0gMTA7XHJcblx0cHVibGljIG1hcmdpbkJvdHRvbTogbnVtYmVyID0gMTA7XHJcblx0cHVibGljIG1hcmdpbkxlZnQ6IG51bWJlciA9IDEwO1xyXG5cdHB1YmxpYyBpc0RyYWdnaW5nOiBib29sZWFuID0gZmFsc2U7XHJcblx0cHVibGljIGlzUmVzaXppbmc6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHRwdWJsaWMgYXV0b1N0eWxlOiBib29sZWFuID0gdHJ1ZTtcclxuXHRwdWJsaWMgcmVzaXplRW5hYmxlOiBib29sZWFuID0gdHJ1ZTtcclxuXHRwdWJsaWMgZHJhZ0VuYWJsZTogYm9vbGVhbiA9IHRydWU7XHJcblx0cHVibGljIGNhc2NhZGU6IHN0cmluZyA9ICd1cCc7XHJcblx0cHVibGljIG1pbldpZHRoOiBudW1iZXIgPSAxMDA7XHJcblx0cHVibGljIG1pbkhlaWdodDogbnVtYmVyID0gMTAwO1xyXG5cclxuXHQvL1x0UHJpdmF0ZSB2YXJpYWJsZXNcclxuXHRwcml2YXRlIF9pdGVtczogQXJyYXk8TmdHcmlkSXRlbT4gPSBbXTtcclxuXHRwcml2YXRlIF9kcmFnZ2luZ0l0ZW06IE5nR3JpZEl0ZW0gPSBudWxsO1xyXG5cdHByaXZhdGUgX3Jlc2l6aW5nSXRlbTogTmdHcmlkSXRlbSA9IG51bGw7XHJcblx0cHJpdmF0ZSBfcmVzaXplRGlyZWN0aW9uOiBzdHJpbmcgPSBudWxsO1xyXG5cdHByaXZhdGUgX2l0ZW1HcmlkOiB7IFtrZXk6IG51bWJlcl06IHsgW2tleTogbnVtYmVyXTogTmdHcmlkSXRlbSB9IH0gPSB7IDE6IHsgMTogbnVsbCB9IH07XHJcblx0cHJpdmF0ZSBfY29udGFpbmVyV2lkdGg6IG51bWJlcjtcclxuXHRwcml2YXRlIF9jb250YWluZXJIZWlnaHQ6IG51bWJlcjtcclxuXHRwcml2YXRlIF9tYXhDb2xzOiBudW1iZXIgPSAwO1xyXG5cdHByaXZhdGUgX21heFJvd3M6IG51bWJlciA9IDA7XHJcblx0cHJpdmF0ZSBfdmlzaWJsZUNvbHM6IG51bWJlciA9IDA7XHJcblx0cHJpdmF0ZSBfdmlzaWJsZVJvd3M6IG51bWJlciA9IDA7XHJcblx0cHJpdmF0ZSBfc2V0V2lkdGg6IG51bWJlciA9IDI1MDtcclxuXHRwcml2YXRlIF9zZXRIZWlnaHQ6IG51bWJlciA9IDI1MDtcclxuXHRwcml2YXRlIF9wb3NPZmZzZXQ6IE5nR3JpZFJhd1Bvc2l0aW9uID0gbnVsbDtcclxuXHRwcml2YXRlIF9hZGRpbmc6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHRwcml2YXRlIF9wbGFjZWhvbGRlclJlZjogQ29tcG9uZW50UmVmPE5nR3JpZFBsYWNlaG9sZGVyPiA9IG51bGw7XHJcblx0cHJpdmF0ZSBfZml4VG9HcmlkOiBib29sZWFuID0gZmFsc2U7XHJcblx0cHJpdmF0ZSBfYXV0b1Jlc2l6ZTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cdHByaXZhdGUgX2RpZmZlcjogS2V5VmFsdWVEaWZmZXI7XHJcblx0cHJpdmF0ZSBfZGVzdHJveWVkOiBib29sZWFuID0gZmFsc2U7XHJcblx0cHJpdmF0ZSBfbWFpbnRhaW5SYXRpbzogYm9vbGVhbiA9IGZhbHNlO1xyXG5cdHByaXZhdGUgX2FzcGVjdFJhdGlvOiBudW1iZXI7XHJcblx0cHJpdmF0ZSBfcHJlZmVyTmV3OiBib29sZWFuID0gZmFsc2U7XHJcblx0cHJpdmF0ZSBfem9vbU9uRHJhZzogYm9vbGVhbiA9IGZhbHNlO1xyXG5cdHByaXZhdGUgX2xpbWl0VG9TY3JlZW46IGJvb2xlYW4gPSBmYWxzZTtcclxuXHRwcml2YXRlIF9jdXJNYXhSb3c6IG51bWJlciA9IDA7XHJcblx0cHJpdmF0ZSBfY3VyTWF4Q29sOiBudW1iZXIgPSAwO1xyXG5cclxuXHQvL1x0RGVmYXVsdCBjb25maWdcclxuXHRwcml2YXRlIHN0YXRpYyBDT05TVF9ERUZBVUxUX0NPTkZJRzogTmdHcmlkQ29uZmlnID0ge1xyXG5cdFx0bWFyZ2luczogWzEwXSxcclxuXHRcdGRyYWdnYWJsZTogdHJ1ZSxcclxuXHRcdHJlc2l6YWJsZTogdHJ1ZSxcclxuXHRcdG1heF9jb2xzOiAwLFxyXG5cdFx0bWF4X3Jvd3M6IDAsXHJcblx0XHR2aXNpYmxlX2NvbHM6IDAsXHJcblx0XHR2aXNpYmxlX3Jvd3M6IDAsXHJcblx0XHRjb2xfd2lkdGg6IDI1MCxcclxuXHRcdHJvd19oZWlnaHQ6IDI1MCxcclxuXHRcdGNhc2NhZGU6ICd1cCcsXHJcblx0XHRtaW5fd2lkdGg6IDEwMCxcclxuXHRcdG1pbl9oZWlnaHQ6IDEwMCxcclxuXHRcdGZpeF90b19ncmlkOiBmYWxzZSxcclxuXHRcdGF1dG9fc3R5bGU6IHRydWUsXHJcblx0XHRhdXRvX3Jlc2l6ZTogZmFsc2UsXHJcblx0XHRtYWludGFpbl9yYXRpbzogZmFsc2UsXHJcblx0XHRwcmVmZXJfbmV3OiBmYWxzZSxcclxuXHRcdHpvb21fb25fZHJhZzogZmFsc2VcclxuXHR9O1xyXG5cdHByaXZhdGUgX2NvbmZpZyA9IE5nR3JpZC5DT05TVF9ERUZBVUxUX0NPTkZJRztcclxuXHJcblx0Ly9cdFtuZy1ncmlkXSBhdHRyaWJ1dGUgaGFuZGxlclxyXG5cdHNldCBjb25maWcodjogTmdHcmlkQ29uZmlnKSB7XHJcblx0XHR0aGlzLnNldENvbmZpZyh2KTtcclxuXHJcblx0XHRpZiAodGhpcy5fZGlmZmVyID09IG51bGwgJiYgdiAhPSBudWxsKSB7XHJcblx0XHRcdHRoaXMuX2RpZmZlciA9IHRoaXMuX2RpZmZlcnMuZmluZCh0aGlzLl9jb25maWcpLmNyZWF0ZShudWxsKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8vXHRDb25zdHJ1Y3RvclxyXG5cdGNvbnN0cnVjdG9yKHByaXZhdGUgX2RpZmZlcnM6IEtleVZhbHVlRGlmZmVycyxcclxuXHRcdFx0XHRwcml2YXRlIF9uZ0VsOiBFbGVtZW50UmVmLFxyXG5cdFx0XHRcdHByaXZhdGUgX3JlbmRlcmVyOiBSZW5kZXJlcixcclxuXHRcdFx0XHRwcml2YXRlIGNvbXBvbmVudEZhY3RvcnlSZXNvbHZlcjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxyXG5cdFx0XHRcdHByaXZhdGUgX2NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZikge31cclxuXHJcblx0Ly9cdFB1YmxpYyBtZXRob2RzXHJcblx0cHVibGljIG5nT25Jbml0KCk6IHZvaWQge1xyXG5cdFx0dGhpcy5fcmVuZGVyZXIuc2V0RWxlbWVudENsYXNzKHRoaXMuX25nRWwubmF0aXZlRWxlbWVudCwgJ2dyaWQnLCB0cnVlKTtcclxuXHRcdGlmICh0aGlzLmF1dG9TdHlsZSkgdGhpcy5fcmVuZGVyZXIuc2V0RWxlbWVudFN0eWxlKHRoaXMuX25nRWwubmF0aXZlRWxlbWVudCwgJ3Bvc2l0aW9uJywgJ3JlbGF0aXZlJyk7XHJcblx0XHR0aGlzLnNldENvbmZpZyh0aGlzLl9jb25maWcpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIG5nT25EZXN0cm95KCk6IHZvaWQge1xyXG5cdFx0dGhpcy5fZGVzdHJveWVkID0gdHJ1ZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXRDb25maWcoY29uZmlnOiBOZ0dyaWRDb25maWcpOiB2b2lkIHtcclxuXHRcdHRoaXMuX2NvbmZpZyA9IGNvbmZpZztcclxuXHJcblx0XHR2YXIgbWF4Q29sUm93Q2hhbmdlZCA9IGZhbHNlO1xyXG5cdFx0Zm9yICh2YXIgeCBpbiBjb25maWcpIHtcclxuXHRcdFx0dmFyIHZhbCA9IGNvbmZpZ1t4XTtcclxuXHRcdFx0dmFyIGludFZhbCA9ICF2YWwgPyAwIDogcGFyc2VJbnQodmFsKTtcclxuXHJcblx0XHRcdHN3aXRjaCAoeCkge1xyXG5cdFx0XHRcdGNhc2UgJ21hcmdpbnMnOlxyXG5cdFx0XHRcdFx0dGhpcy5zZXRNYXJnaW5zKHZhbCk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlICdjb2xfd2lkdGgnOlxyXG5cdFx0XHRcdFx0dGhpcy5jb2xXaWR0aCA9IE1hdGgubWF4KGludFZhbCwgMSk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlICdyb3dfaGVpZ2h0JzpcclxuXHRcdFx0XHRcdHRoaXMucm93SGVpZ2h0ID0gTWF0aC5tYXgoaW50VmFsLCAxKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgJ2F1dG9fc3R5bGUnOlxyXG5cdFx0XHRcdFx0dGhpcy5hdXRvU3R5bGUgPSB2YWwgPyB0cnVlIDogZmFsc2U7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlICdhdXRvX3Jlc2l6ZSc6XHJcblx0XHRcdFx0XHR0aGlzLl9hdXRvUmVzaXplID0gdmFsID8gdHJ1ZSA6IGZhbHNlO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAnZHJhZ2dhYmxlJzpcclxuXHRcdFx0XHRcdHRoaXMuZHJhZ0VuYWJsZSA9IHZhbCA/IHRydWUgOiBmYWxzZTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgJ3Jlc2l6YWJsZSc6XHJcblx0XHRcdFx0XHR0aGlzLnJlc2l6ZUVuYWJsZSA9IHZhbCA/IHRydWUgOiBmYWxzZTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgJ21heF9yb3dzJzpcclxuXHRcdFx0XHRcdG1heENvbFJvd0NoYW5nZWQgPSBtYXhDb2xSb3dDaGFuZ2VkIHx8IHRoaXMuX21heFJvd3MgIT0gaW50VmFsO1xyXG5cdFx0XHRcdFx0dGhpcy5fbWF4Um93cyA9IGludFZhbCA8IDAgPyAwIDogaW50VmFsO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAnbWF4X2NvbHMnOlxyXG5cdFx0XHRcdFx0bWF4Q29sUm93Q2hhbmdlZCA9IG1heENvbFJvd0NoYW5nZWQgfHwgdGhpcy5fbWF4Q29scyAhPSBpbnRWYWw7XHJcblx0XHRcdFx0XHR0aGlzLl9tYXhDb2xzID0gaW50VmFsIDwgMCA/IDAgOiBpbnRWYWw7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlICd2aXNpYmxlX3Jvd3MnOlxyXG5cdFx0XHRcdFx0dGhpcy5fdmlzaWJsZVJvd3MgPSBNYXRoLm1heChpbnRWYWwsIDApO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAndmlzaWJsZV9jb2xzJzpcclxuXHRcdFx0XHRcdHRoaXMuX3Zpc2libGVDb2xzID0gTWF0aC5tYXgoaW50VmFsLCAwKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgJ21pbl9yb3dzJzpcclxuXHRcdFx0XHRcdHRoaXMubWluUm93cyA9IE1hdGgubWF4KGludFZhbCwgMSk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlICdtaW5fY29scyc6XHJcblx0XHRcdFx0XHR0aGlzLm1pbkNvbHMgPSBNYXRoLm1heChpbnRWYWwsIDEpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAnbWluX2hlaWdodCc6XHJcblx0XHRcdFx0XHR0aGlzLm1pbkhlaWdodCA9IE1hdGgubWF4KGludFZhbCwgMSk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlICdtaW5fd2lkdGgnOlxyXG5cdFx0XHRcdFx0dGhpcy5taW5XaWR0aCA9IE1hdGgubWF4KGludFZhbCwgMSk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlICd6b29tX29uX2RyYWcnOlxyXG5cdFx0XHRcdFx0dGhpcy5fem9vbU9uRHJhZyA9IHZhbCA/IHRydWUgOiBmYWxzZTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgJ2Nhc2NhZGUnOlxyXG5cdFx0XHRcdFx0aWYgKHRoaXMuY2FzY2FkZSAhPSB2YWwpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5jYXNjYWRlID0gdmFsO1xyXG5cdFx0XHRcdFx0XHR0aGlzLl9jYXNjYWRlR3JpZCgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAnZml4X3RvX2dyaWQnOlxyXG5cdFx0XHRcdFx0dGhpcy5fZml4VG9HcmlkID0gdmFsID8gdHJ1ZSA6IGZhbHNlO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAnbWFpbnRhaW5fcmF0aW8nOlxyXG5cdFx0XHRcdFx0dGhpcy5fbWFpbnRhaW5SYXRpbyA9IHZhbCA/IHRydWUgOiBmYWxzZTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgJ3ByZWZlcl9uZXcnOlxyXG5cdFx0XHRcdFx0dGhpcy5fcHJlZmVyTmV3ID0gdmFsID8gdHJ1ZSA6IGZhbHNlO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAnbGltaXRfdG9fc2NyZWVuJzpcclxuXHRcdFx0XHRcdHRoaXMuX2xpbWl0VG9TY3JlZW4gPSB2YWwgPyB0cnVlIDogZmFsc2U7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh0aGlzLl9tYWludGFpblJhdGlvKSB7XHJcblx0XHRcdGlmICh0aGlzLmNvbFdpZHRoICYmIHRoaXMucm93SGVpZ2h0KSB7XHJcblx0XHRcdFx0dGhpcy5fYXNwZWN0UmF0aW8gPSB0aGlzLmNvbFdpZHRoIC8gdGhpcy5yb3dIZWlnaHQ7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dGhpcy5fbWFpbnRhaW5SYXRpbyA9IGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKG1heENvbFJvd0NoYW5nZWQpIHtcclxuXHRcdFx0aWYgKHRoaXMuX21heENvbHMgPiAwICYmIHRoaXMuX21heFJvd3MgPiAwKSB7XHQvL1x0Q2FuJ3QgaGF2ZSBib3RoLCBwcmlvcml0aXNlIG9uIGNhc2NhZGVcclxuXHRcdFx0XHRzd2l0Y2ggKHRoaXMuY2FzY2FkZSkge1xyXG5cdFx0XHRcdFx0Y2FzZSAnbGVmdCc6XHJcblx0XHRcdFx0XHRjYXNlICdyaWdodCc6XHJcblx0XHRcdFx0XHRcdHRoaXMuX21heENvbHMgPSAwO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgJ3VwJzpcclxuXHRcdFx0XHRcdGNhc2UgJ2Rvd24nOlxyXG5cdFx0XHRcdFx0ZGVmYXVsdDpcclxuXHRcdFx0XHRcdFx0dGhpcy5fbWF4Um93cyA9IDA7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Zm9yIChsZXQgaXRlbSBvZiB0aGlzLl9pdGVtcykge1xyXG5cdFx0XHRcdHZhciBwb3MgPSBpdGVtLmdldEdyaWRQb3NpdGlvbigpO1xyXG5cdFx0XHRcdHZhciBkaW1zID0gaXRlbS5nZXRTaXplKCk7XHJcblxyXG5cdFx0XHRcdHRoaXMuX3JlbW92ZUZyb21HcmlkKGl0ZW0pO1xyXG5cclxuXHRcdFx0XHRpZiAodGhpcy5fbWF4Q29scyA+IDAgJiYgZGltcy54ID4gdGhpcy5fbWF4Q29scykge1xyXG5cdFx0XHRcdFx0ZGltcy54ID0gdGhpcy5fbWF4Q29scztcclxuXHRcdFx0XHRcdGl0ZW0uc2V0U2l6ZShkaW1zKTtcclxuXHRcdFx0XHR9IGVsc2UgaWYgKHRoaXMuX21heFJvd3MgPiAwICYmIGRpbXMueSA+IHRoaXMuX21heFJvd3MpIHtcclxuXHRcdFx0XHRcdGRpbXMueSA9IHRoaXMuX21heFJvd3M7XHJcblx0XHRcdFx0XHRpdGVtLnNldFNpemUoZGltcyk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAodGhpcy5faGFzR3JpZENvbGxpc2lvbihwb3MsIGRpbXMpIHx8ICF0aGlzLl9pc1dpdGhpbkJvdW5kcyhwb3MsIGRpbXMpKSB7XHJcblx0XHRcdFx0XHR2YXIgbmV3UG9zaXRpb24gPSB0aGlzLl9maXhHcmlkUG9zaXRpb24ocG9zLCBkaW1zKTtcclxuXHRcdFx0XHRcdGl0ZW0uc2V0R3JpZFBvc2l0aW9uKG5ld1Bvc2l0aW9uKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHRoaXMuX2FkZFRvR3JpZChpdGVtKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5fY2FzY2FkZUdyaWQoKTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLl9jYWxjdWxhdGVSb3dIZWlnaHQoKTtcclxuXHRcdHRoaXMuX2NhbGN1bGF0ZUNvbFdpZHRoKCk7XHJcblxyXG5cdFx0dmFyIG1heFdpZHRoID0gdGhpcy5fbWF4Q29scyAqIHRoaXMuY29sV2lkdGg7XHJcblx0XHR2YXIgbWF4SGVpZ2h0ID0gdGhpcy5fbWF4Um93cyAqIHRoaXMucm93SGVpZ2h0O1xyXG5cclxuXHRcdGlmIChtYXhXaWR0aCA+IDAgJiYgdGhpcy5taW5XaWR0aCA+IG1heFdpZHRoKSB0aGlzLm1pbldpZHRoID0gMC43NSAqIHRoaXMuY29sV2lkdGg7XHJcblx0XHRpZiAobWF4SGVpZ2h0ID4gMCAmJiB0aGlzLm1pbkhlaWdodCA+IG1heEhlaWdodCkgdGhpcy5taW5IZWlnaHQgPSAwLjc1ICogdGhpcy5yb3dIZWlnaHQ7XHJcblxyXG5cdFx0aWYgKHRoaXMubWluV2lkdGggPiB0aGlzLmNvbFdpZHRoKSB0aGlzLm1pbkNvbHMgPSBNYXRoLm1heCh0aGlzLm1pbkNvbHMsIE1hdGguY2VpbCh0aGlzLm1pbldpZHRoIC8gdGhpcy5jb2xXaWR0aCkpO1xyXG5cdFx0aWYgKHRoaXMubWluSGVpZ2h0ID4gdGhpcy5yb3dIZWlnaHQpIHRoaXMubWluUm93cyA9IE1hdGgubWF4KHRoaXMubWluUm93cywgTWF0aC5jZWlsKHRoaXMubWluSGVpZ2h0IC8gdGhpcy5yb3dIZWlnaHQpKTtcclxuXHJcblx0XHRpZiAodGhpcy5fbWF4Q29scyA+IDAgJiYgdGhpcy5taW5Db2xzID4gdGhpcy5fbWF4Q29scykgdGhpcy5taW5Db2xzID0gMTtcclxuXHRcdGlmICh0aGlzLl9tYXhSb3dzID4gMCAmJiB0aGlzLm1pblJvd3MgPiB0aGlzLl9tYXhSb3dzKSB0aGlzLm1pblJvd3MgPSAxO1xyXG5cclxuXHRcdHRoaXMuX3VwZGF0ZVJhdGlvKCk7XHJcblx0XHRcclxuXHRcdGZvciAobGV0IGl0ZW0gb2YgdGhpcy5faXRlbXMpIHtcclxuXHRcdFx0dGhpcy5fcmVtb3ZlRnJvbUdyaWQoaXRlbSk7XHJcblx0XHRcdGl0ZW0uc2V0Q2FzY2FkZU1vZGUodGhpcy5jYXNjYWRlKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0dGhpcy5fdXBkYXRlTGltaXQoKTtcclxuXHRcdFxyXG5cdFx0Zm9yIChsZXQgaXRlbSBvZiB0aGlzLl9pdGVtcykge1xyXG5cdFx0XHRpdGVtLnJlY2FsY3VsYXRlU2VsZigpO1xyXG5cdFx0XHR0aGlzLl9hZGRUb0dyaWQoaXRlbSk7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5fY2FzY2FkZUdyaWQoKTtcclxuXHRcdHRoaXMuX3VwZGF0ZVNpemUoKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXRJdGVtUG9zaXRpb24oaW5kZXg6IG51bWJlcik6IE5nR3JpZEl0ZW1Qb3NpdGlvbiB7XHJcblx0XHRyZXR1cm4gdGhpcy5faXRlbXNbaW5kZXhdLmdldEdyaWRQb3NpdGlvbigpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldEl0ZW1TaXplKGluZGV4OiBudW1iZXIpOiBOZ0dyaWRJdGVtU2l6ZSB7XHJcblx0XHRyZXR1cm4gdGhpcy5faXRlbXNbaW5kZXhdLmdldFNpemUoKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBuZ0RvQ2hlY2soKTogYm9vbGVhbiB7XHJcblx0XHRpZiAodGhpcy5fZGlmZmVyICE9IG51bGwpIHtcclxuXHRcdFx0dmFyIGNoYW5nZXMgPSB0aGlzLl9kaWZmZXIuZGlmZih0aGlzLl9jb25maWcpO1xyXG5cclxuXHRcdFx0aWYgKGNoYW5nZXMgIT0gbnVsbCkge1xyXG5cdFx0XHRcdHRoaXMuX2FwcGx5Q2hhbmdlcyhjaGFuZ2VzKTtcclxuXHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0TWFyZ2lucyhtYXJnaW5zOiBBcnJheTxzdHJpbmc+KTogdm9pZCB7XHJcblx0XHR0aGlzLm1hcmdpblRvcCA9IE1hdGgubWF4KHBhcnNlSW50KG1hcmdpbnNbMF0pLCAwKTtcclxuXHRcdHRoaXMubWFyZ2luUmlnaHQgPSBtYXJnaW5zLmxlbmd0aCA+PSAyID8gTWF0aC5tYXgocGFyc2VJbnQobWFyZ2luc1sxXSksIDApIDogdGhpcy5tYXJnaW5Ub3A7XHJcblx0XHR0aGlzLm1hcmdpbkJvdHRvbSA9IG1hcmdpbnMubGVuZ3RoID49IDMgPyBNYXRoLm1heChwYXJzZUludChtYXJnaW5zWzJdKSwgMCkgOiB0aGlzLm1hcmdpblRvcDtcclxuXHRcdHRoaXMubWFyZ2luQm90dG9tID0gbWFyZ2lucy5sZW5ndGggPj0gMyA/IE1hdGgubWF4KHBhcnNlSW50KG1hcmdpbnNbMl0pLCAwKSA6IHRoaXMubWFyZ2luVG9wO1xyXG5cdFx0dGhpcy5tYXJnaW5MZWZ0ID0gbWFyZ2lucy5sZW5ndGggPj0gNCA/IE1hdGgubWF4KHBhcnNlSW50KG1hcmdpbnNbM10pLCAwKSA6IHRoaXMubWFyZ2luUmlnaHQ7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZW5hYmxlRHJhZygpOiB2b2lkIHtcclxuXHRcdHRoaXMuZHJhZ0VuYWJsZSA9IHRydWU7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZGlzYWJsZURyYWcoKTogdm9pZCB7XHJcblx0XHR0aGlzLmRyYWdFbmFibGUgPSBmYWxzZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBlbmFibGVSZXNpemUoKTogdm9pZCB7XHJcblx0XHR0aGlzLnJlc2l6ZUVuYWJsZSA9IHRydWU7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZGlzYWJsZVJlc2l6ZSgpOiB2b2lkIHtcclxuXHRcdHRoaXMucmVzaXplRW5hYmxlID0gZmFsc2U7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgYWRkSXRlbShuZ0l0ZW06IE5nR3JpZEl0ZW0pOiB2b2lkIHtcclxuXHRcdG5nSXRlbS5zZXRDYXNjYWRlTW9kZSh0aGlzLmNhc2NhZGUpO1xyXG5cdFx0aWYgKCF0aGlzLl9wcmVmZXJOZXcpIHtcclxuXHRcdFx0dmFyIG5ld1BvcyA9IHRoaXMuX2ZpeEdyaWRQb3NpdGlvbihuZ0l0ZW0uZ2V0R3JpZFBvc2l0aW9uKCksIG5nSXRlbS5nZXRTaXplKCkpO1xyXG5cdFx0XHRuZ0l0ZW0uc2F2ZVBvc2l0aW9uKG5ld1Bvcyk7XHJcblx0XHR9XHJcblx0XHR0aGlzLl9pdGVtcy5wdXNoKG5nSXRlbSk7XHJcblx0XHR0aGlzLl9hZGRUb0dyaWQobmdJdGVtKTtcclxuXHRcdG5nSXRlbS5yZWNhbGN1bGF0ZVNlbGYoKTtcclxuXHRcdG5nSXRlbS5vbkNhc2NhZGVFdmVudCgpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHJlbW92ZUl0ZW0obmdJdGVtOiBOZ0dyaWRJdGVtKTogdm9pZCB7XHJcblx0XHR0aGlzLl9yZW1vdmVGcm9tR3JpZChuZ0l0ZW0pO1xyXG5cclxuXHRcdGZvciAobGV0IHg6IG51bWJlciA9IDA7IHggPCB0aGlzLl9pdGVtcy5sZW5ndGg7IHgrKykge1xyXG5cdFx0XHRpZiAodGhpcy5faXRlbXNbeF0gPT0gbmdJdGVtKSB7XHJcblx0XHRcdFx0dGhpcy5faXRlbXMuc3BsaWNlKHgsIDEpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHRoaXMuX2Rlc3Ryb3llZCkgcmV0dXJuO1xyXG5cclxuXHRcdHRoaXMuX2Nhc2NhZGVHcmlkKCk7XHJcblx0XHR0aGlzLl91cGRhdGVTaXplKCk7XHJcblx0XHR0aGlzLl9pdGVtcy5mb3JFYWNoKChpdGVtOiBOZ0dyaWRJdGVtKSA9PiBpdGVtLnJlY2FsY3VsYXRlU2VsZigpKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyB1cGRhdGVJdGVtKG5nSXRlbTogTmdHcmlkSXRlbSk6IHZvaWQge1xyXG5cdFx0dGhpcy5fcmVtb3ZlRnJvbUdyaWQobmdJdGVtKTtcclxuXHRcdHRoaXMuX2FkZFRvR3JpZChuZ0l0ZW0pO1xyXG5cdFx0dGhpcy5fY2FzY2FkZUdyaWQoKTtcclxuXHRcdHRoaXMuX3VwZGF0ZVNpemUoKTtcclxuXHRcdG5nSXRlbS5vbkNhc2NhZGVFdmVudCgpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHRyaWdnZXJDYXNjYWRlKCk6IHZvaWQge1xyXG5cdFx0dGhpcy5fY2FzY2FkZUdyaWQobnVsbCwgbnVsbCwgZmFsc2UpO1xyXG5cdH1cclxuXHJcblx0Ly9cdFByaXZhdGUgbWV0aG9kc1xyXG5cdHByaXZhdGUgX2NhbGN1bGF0ZUNvbFdpZHRoKCk6IHZvaWQge1xyXG5cdFx0aWYgKHRoaXMuX2F1dG9SZXNpemUpIHtcclxuXHRcdFx0aWYgKHRoaXMuX21heENvbHMgPiAwIHx8IHRoaXMuX3Zpc2libGVDb2xzID4gMCkge1xyXG5cdFx0XHRcdHZhciBtYXhDb2xzID0gdGhpcy5fbWF4Q29scyA+IDAgPyB0aGlzLl9tYXhDb2xzIDogdGhpcy5fdmlzaWJsZUNvbHM7XHJcblx0XHRcdFx0dmFyIG1heFdpZHRoOiBudW1iZXIgPSB0aGlzLl9uZ0VsLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg7XHJcblxyXG5cdFx0XHRcdHZhciBjb2xXaWR0aDogbnVtYmVyID0gTWF0aC5mbG9vcihtYXhXaWR0aCAvIG1heENvbHMpO1xyXG5cdFx0XHRcdGNvbFdpZHRoIC09ICh0aGlzLm1hcmdpbkxlZnQgKyB0aGlzLm1hcmdpblJpZ2h0KTtcclxuXHRcdFx0XHRpZiAoY29sV2lkdGggPiAwKSB0aGlzLmNvbFdpZHRoID0gY29sV2lkdGg7XHJcblxyXG5cdFx0XHRcdGlmICh0aGlzLmNvbFdpZHRoIDwgdGhpcy5taW5XaWR0aCB8fCB0aGlzLm1pbkNvbHMgPiB0aGlzLl9jb25maWcubWluX2NvbHMpIHtcclxuXHRcdFx0XHRcdHRoaXMubWluQ29scyA9IE1hdGgubWF4KHRoaXMuX2NvbmZpZy5taW5fY29scywgTWF0aC5jZWlsKHRoaXMubWluV2lkdGggLyB0aGlzLmNvbFdpZHRoKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF9jYWxjdWxhdGVSb3dIZWlnaHQoKTogdm9pZCB7XHJcblx0XHRpZiAodGhpcy5fYXV0b1Jlc2l6ZSkge1xyXG5cdFx0XHRpZiAodGhpcy5fbWF4Um93cyA+IDAgfHwgdGhpcy5fdmlzaWJsZVJvd3MgPiAwKSB7XHJcblx0XHRcdFx0dmFyIG1heFJvd3MgPSB0aGlzLl9tYXhSb3dzID4gMCA/IHRoaXMuX21heFJvd3MgOiB0aGlzLl92aXNpYmxlUm93cztcclxuXHRcdFx0XHR2YXIgbWF4SGVpZ2h0OiBudW1iZXIgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XHJcblxyXG5cdFx0XHRcdHZhciByb3dIZWlnaHQ6IG51bWJlciA9IE1hdGgubWF4KE1hdGguZmxvb3IobWF4SGVpZ2h0IC8gbWF4Um93cyksIHRoaXMubWluSGVpZ2h0KTtcclxuXHRcdFx0XHRyb3dIZWlnaHQgLT0gKHRoaXMubWFyZ2luVG9wICsgdGhpcy5tYXJnaW5Cb3R0b20pO1xyXG5cdFx0XHRcdGlmIChyb3dIZWlnaHQgPiAwKSB0aGlzLnJvd0hlaWdodCA9IHJvd0hlaWdodDtcclxuXHJcblx0XHRcdFx0aWYgKHRoaXMucm93SGVpZ2h0IDwgdGhpcy5taW5IZWlnaHQgfHwgdGhpcy5taW5Sb3dzID4gdGhpcy5fY29uZmlnLm1pbl9yb3dzKSB7XHJcblx0XHRcdFx0XHR0aGlzLm1pblJvd3MgPSBNYXRoLm1heCh0aGlzLl9jb25maWcubWluX3Jvd3MsIE1hdGguY2VpbCh0aGlzLm1pbkhlaWdodCAvIHRoaXMucm93SGVpZ2h0KSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF91cGRhdGVSYXRpbygpOiB2b2lkIHtcclxuXHRcdGlmICh0aGlzLl9hdXRvUmVzaXplICYmIHRoaXMuX21haW50YWluUmF0aW8pIHtcclxuXHRcdFx0aWYgKHRoaXMuX21heENvbHMgPiAwICYmIHRoaXMuX3Zpc2libGVSb3dzIDw9IDApIHtcclxuXHRcdFx0XHR0aGlzLnJvd0hlaWdodCA9IHRoaXMuY29sV2lkdGggLyB0aGlzLl9hc3BlY3RSYXRpbztcclxuXHRcdFx0fSBlbHNlIGlmICh0aGlzLl9tYXhSb3dzID4gMCAmJiB0aGlzLl92aXNpYmxlQ29scyA8PSAwKSB7XHJcblx0XHRcdFx0dGhpcy5jb2xXaWR0aCA9IHRoaXMuX2FzcGVjdFJhdGlvICogdGhpcy5yb3dIZWlnaHQ7XHJcblx0XHRcdH0gZWxzZSBpZiAodGhpcy5fbWF4Q29scyA9PSAwICYmIHRoaXMuX21heFJvd3MgPT0gMCkge1xyXG5cdFx0XHRcdGlmICh0aGlzLl92aXNpYmxlQ29scyA+IDApIHtcclxuXHRcdFx0XHRcdHRoaXMucm93SGVpZ2h0ID0gdGhpcy5jb2xXaWR0aCAvIHRoaXMuX2FzcGVjdFJhdGlvO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAodGhpcy5fdmlzaWJsZVJvd3MgPiAwKSB7XHJcblx0XHRcdFx0XHR0aGlzLmNvbFdpZHRoID0gdGhpcy5fYXNwZWN0UmF0aW8gKiB0aGlzLnJvd0hlaWdodDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0cHJpdmF0ZSBfdXBkYXRlTGltaXQoKTogdm9pZCB7XHJcblx0XHRpZiAoIXRoaXMuX2F1dG9SZXNpemUgJiYgdGhpcy5fbGltaXRUb1NjcmVlbikge1xyXG5cdFx0XHR0aGlzLl9saW1pdEdyaWQodGhpcy5fZ2V0Q29udGFpbmVyQ29sdW1ucygpKTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0cHJpdmF0ZSBfb25SZXNpemUoZTogYW55KTogdm9pZCB7XHJcblx0XHR0aGlzLl9jYWxjdWxhdGVDb2xXaWR0aCgpO1xyXG5cdFx0dGhpcy5fY2FsY3VsYXRlUm93SGVpZ2h0KCk7XHJcblxyXG5cdFx0dGhpcy5fdXBkYXRlUmF0aW8oKTtcclxuXHRcdFxyXG5cdFx0Zm9yIChsZXQgaXRlbSBvZiB0aGlzLl9pdGVtcykge1xyXG5cdFx0XHR0aGlzLl9yZW1vdmVGcm9tR3JpZChpdGVtKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0dGhpcy5fdXBkYXRlTGltaXQoKTtcclxuXHRcdFxyXG5cdFx0Zm9yIChsZXQgaXRlbSBvZiB0aGlzLl9pdGVtcykge1xyXG5cdFx0XHR0aGlzLl9hZGRUb0dyaWQoaXRlbSk7XHJcblx0XHRcdGl0ZW0ucmVjYWxjdWxhdGVTZWxmKCk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHRoaXMuX3VwZGF0ZVNpemUoKTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX2FwcGx5Q2hhbmdlcyhjaGFuZ2VzOiBhbnkpOiB2b2lkIHtcclxuXHRcdGNoYW5nZXMuZm9yRWFjaEFkZGVkSXRlbSgocmVjb3JkOiBhbnkpID0+IHsgdGhpcy5fY29uZmlnW3JlY29yZC5rZXldID0gcmVjb3JkLmN1cnJlbnRWYWx1ZTsgfSk7XHJcblx0XHRjaGFuZ2VzLmZvckVhY2hDaGFuZ2VkSXRlbSgocmVjb3JkOiBhbnkpID0+IHsgdGhpcy5fY29uZmlnW3JlY29yZC5rZXldID0gcmVjb3JkLmN1cnJlbnRWYWx1ZTsgfSk7XHJcblx0XHRjaGFuZ2VzLmZvckVhY2hSZW1vdmVkSXRlbSgocmVjb3JkOiBhbnkpID0+IHsgZGVsZXRlIHRoaXMuX2NvbmZpZ1tyZWNvcmQua2V5XTsgfSk7XHJcblxyXG5cdFx0dGhpcy5zZXRDb25maWcodGhpcy5fY29uZmlnKTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX29uTW91c2VEb3duKGU6IGFueSk6IGJvb2xlYW4ge1xyXG5cdFx0dmFyIG1vdXNlUG9zID0gdGhpcy5fZ2V0TW91c2VQb3NpdGlvbihlKTtcclxuXHRcdHZhciBpdGVtID0gdGhpcy5fZ2V0SXRlbUZyb21Qb3NpdGlvbihtb3VzZVBvcyk7XHJcblxyXG5cdFx0aWYgKGl0ZW0gIT0gbnVsbCkge1xyXG5cdFx0XHRpZiAodGhpcy5yZXNpemVFbmFibGUgJiYgaXRlbS5jYW5SZXNpemUoZSkgIT0gbnVsbCkge1xyXG5cdFx0XHRcdHRoaXMuX3Jlc2l6ZVN0YXJ0KGUpO1xyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHRydWU7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF9yZXNpemVTdGFydChlOiBhbnkpOiB2b2lkIHtcclxuXHRcdGlmICh0aGlzLnJlc2l6ZUVuYWJsZSkge1xyXG5cdFx0XHR2YXIgbW91c2VQb3MgPSB0aGlzLl9nZXRNb3VzZVBvc2l0aW9uKGUpO1xyXG5cdFx0XHR2YXIgaXRlbSA9IHRoaXMuX2dldEl0ZW1Gcm9tUG9zaXRpb24obW91c2VQb3MpO1xyXG5cclxuXHRcdFx0aXRlbS5zdGFydE1vdmluZygpO1xyXG5cdFx0XHR0aGlzLl9yZXNpemluZ0l0ZW0gPSBpdGVtO1xyXG5cdFx0XHR0aGlzLl9yZXNpemVEaXJlY3Rpb24gPSBpdGVtLmNhblJlc2l6ZShlKTtcclxuXHRcdFx0dGhpcy5fcmVtb3ZlRnJvbUdyaWQoaXRlbSk7XHJcblx0XHRcdHRoaXMuX2NyZWF0ZVBsYWNlaG9sZGVyKGl0ZW0pO1xyXG5cdFx0XHR0aGlzLmlzUmVzaXppbmcgPSB0cnVlO1xyXG5cclxuXHRcdFx0dGhpcy5vblJlc2l6ZVN0YXJ0LmVtaXQoaXRlbSk7XHJcblx0XHRcdGl0ZW0ub25SZXNpemVTdGFydEV2ZW50KCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF9kcmFnU3RhcnQoZTogYW55KTogdm9pZCB7XHJcblx0XHRpZiAodGhpcy5kcmFnRW5hYmxlKSB7XHJcblx0XHRcdHZhciBtb3VzZVBvcyA9IHRoaXMuX2dldE1vdXNlUG9zaXRpb24oZSk7XHJcblx0XHRcdHZhciBpdGVtID0gdGhpcy5fZ2V0SXRlbUZyb21Qb3NpdGlvbihtb3VzZVBvcyk7XHJcblx0XHRcdHZhciBpdGVtUG9zID0gaXRlbS5nZXRQb3NpdGlvbigpO1xyXG5cdFx0XHR2YXIgcE9mZnNldCA9IHsgJ2xlZnQnOiAobW91c2VQb3MubGVmdCAtIGl0ZW1Qb3MubGVmdCksICd0b3AnOiAobW91c2VQb3MudG9wIC0gaXRlbVBvcy50b3ApIH1cclxuXHJcblx0XHRcdGl0ZW0uc3RhcnRNb3ZpbmcoKTtcclxuXHRcdFx0dGhpcy5fZHJhZ2dpbmdJdGVtID0gaXRlbTtcclxuXHRcdFx0dGhpcy5fcG9zT2Zmc2V0ID0gcE9mZnNldDtcclxuXHRcdFx0dGhpcy5fcmVtb3ZlRnJvbUdyaWQoaXRlbSk7XHJcblx0XHRcdHRoaXMuX2NyZWF0ZVBsYWNlaG9sZGVyKGl0ZW0pO1xyXG5cdFx0XHR0aGlzLmlzRHJhZ2dpbmcgPSB0cnVlO1xyXG5cclxuXHRcdFx0dGhpcy5vbkRyYWdTdGFydC5lbWl0KGl0ZW0pO1xyXG5cdFx0XHRpdGVtLm9uRHJhZ1N0YXJ0RXZlbnQoKTtcclxuXHRcdFx0XHJcblx0XHRcdGlmICh0aGlzLl96b29tT25EcmFnKSB7XHJcblx0XHRcdFx0dGhpcy5fem9vbU91dCgpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdHByaXZhdGUgX3pvb21PdXQoKTogdm9pZCB7XHJcblx0XHR0aGlzLl9yZW5kZXJlci5zZXRFbGVtZW50U3R5bGUodGhpcy5fbmdFbC5uYXRpdmVFbGVtZW50LCAndHJhbnNmb3JtJywgJ3NjYWxlKDAuNSwgMC41KScpO1xyXG5cdH1cclxuXHRcclxuXHRwcml2YXRlIF9yZXNldFpvb20oKTogdm9pZCB7XHJcblx0XHR0aGlzLl9yZW5kZXJlci5zZXRFbGVtZW50U3R5bGUodGhpcy5fbmdFbC5uYXRpdmVFbGVtZW50LCAndHJhbnNmb3JtJywgJycpO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfb25Nb3VzZU1vdmUoZTogYW55KTogYm9vbGVhbiB7XHJcblx0XHRpZiAoZS5idXR0b25zID09IDEgJiYgdGhpcy5kcmFnRW5hYmxlICYmICF0aGlzLmlzRHJhZ2dpbmcgJiYgIXRoaXMuaXNSZXNpemluZykge1xyXG5cdFx0XHR2YXIgbW91c2VQb3MgPSB0aGlzLl9nZXRNb3VzZVBvc2l0aW9uKGUpO1xyXG5cdFx0XHR2YXIgaXRlbSA9IHRoaXMuX2dldEl0ZW1Gcm9tUG9zaXRpb24obW91c2VQb3MpO1xyXG5cdFx0XHRcclxuXHRcdFx0aWYgKGl0ZW0gIT0gbnVsbCAmJiBpdGVtLmNhbkRyYWcoZSkpIHtcclxuXHRcdFx0XHR0aGlzLl9kcmFnU3RhcnQoZSk7XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGlmIChlLmJ1dHRvbnMgPT0gMCAmJiB0aGlzLmlzRHJhZ2dpbmcpIHtcclxuXHRcdFx0dGhpcy5fZHJhZ1N0b3AoZSk7XHJcblx0XHR9IGVsc2UgaWYgKGUuYnV0dG9ucyA9PSAwICYmIHRoaXMuaXNSZXNpemluZykge1xyXG5cdFx0XHR0aGlzLl9yZXNpemVTdG9wKGUpO1xyXG5cdFx0fSBlbHNlIGlmICh0aGlzLmlzRHJhZ2dpbmcpIHtcclxuXHRcdFx0dGhpcy5fZHJhZyhlKTtcclxuXHRcdH0gZWxzZSBpZiAodGhpcy5pc1Jlc2l6aW5nKSB7XHJcblx0XHRcdHRoaXMuX3Jlc2l6ZShlKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHZhciBtb3VzZVBvcyA9IHRoaXMuX2dldE1vdXNlUG9zaXRpb24oZSk7XHJcblx0XHRcdHZhciBpdGVtID0gdGhpcy5fZ2V0SXRlbUZyb21Qb3NpdGlvbihtb3VzZVBvcyk7XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAoaXRlbSkge1xyXG5cdFx0XHRcdGl0ZW0ub25Nb3VzZU1vdmUoZSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cmV0dXJuIHRydWU7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF9kcmFnKGU6IGFueSk6IHZvaWQge1xyXG5cdFx0aWYgKHRoaXMuaXNEcmFnZ2luZykge1xyXG5cdFx0XHR2YXIgbW91c2VQb3MgPSB0aGlzLl9nZXRNb3VzZVBvc2l0aW9uKGUpO1xyXG5cdFx0XHR2YXIgbmV3TCA9IChtb3VzZVBvcy5sZWZ0IC0gdGhpcy5fcG9zT2Zmc2V0LmxlZnQpO1xyXG5cdFx0XHR2YXIgbmV3VCA9IChtb3VzZVBvcy50b3AgLSB0aGlzLl9wb3NPZmZzZXQudG9wKTtcclxuXHJcblx0XHRcdHZhciBpdGVtUG9zID0gdGhpcy5fZHJhZ2dpbmdJdGVtLmdldEdyaWRQb3NpdGlvbigpO1xyXG5cdFx0XHR2YXIgZ3JpZFBvcyA9IHRoaXMuX2NhbGN1bGF0ZUdyaWRQb3NpdGlvbihuZXdMLCBuZXdUKTtcclxuXHRcdFx0dmFyIGRpbXMgPSB0aGlzLl9kcmFnZ2luZ0l0ZW0uZ2V0U2l6ZSgpO1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLl9pc1dpdGhpbkJvdW5kc1goZ3JpZFBvcywgZGltcykpXHJcblx0XHRcdFx0Z3JpZFBvcy5jb2wgPSB0aGlzLl9tYXhDb2xzIC0gKGRpbXMueCAtIDEpO1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLl9pc1dpdGhpbkJvdW5kc1koZ3JpZFBvcywgZGltcykpXHJcblx0XHRcdFx0Z3JpZFBvcy5yb3cgPSB0aGlzLl9tYXhSb3dzIC0gKGRpbXMueSAtIDEpO1xyXG5cdFx0XHRcclxuXHRcdFx0aWYgKCF0aGlzLl9hdXRvUmVzaXplICYmIHRoaXMuX2xpbWl0VG9TY3JlZW4pIHtcclxuXHRcdFx0XHRpZiAoKGdyaWRQb3MuY29sICsgZGltcy54IC0gMSkgPiB0aGlzLl9nZXRDb250YWluZXJDb2x1bW5zKCkpIHtcclxuXHRcdFx0XHRcdGdyaWRQb3MuY29sID0gdGhpcy5fZ2V0Q29udGFpbmVyQ29sdW1ucygpIC0gKGRpbXMueCAtIDEpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKGdyaWRQb3MuY29sICE9IGl0ZW1Qb3MuY29sIHx8IGdyaWRQb3Mucm93ICE9IGl0ZW1Qb3Mucm93KSB7XHJcblx0XHRcdFx0dGhpcy5fZHJhZ2dpbmdJdGVtLnNldEdyaWRQb3NpdGlvbihncmlkUG9zLCB0aGlzLl9maXhUb0dyaWQpO1xyXG5cdFx0XHRcdHRoaXMuX3BsYWNlaG9sZGVyUmVmLmluc3RhbmNlLnNldEdyaWRQb3NpdGlvbihncmlkUG9zKTtcclxuXHJcblx0XHRcdFx0aWYgKFsndXAnLCAnZG93bicsICdsZWZ0JywgJ3JpZ2h0J10uaW5kZXhPZih0aGlzLmNhc2NhZGUpID49IDApIHtcclxuXHRcdFx0XHRcdHRoaXMuX2ZpeEdyaWRDb2xsaXNpb25zKGdyaWRQb3MsIGRpbXMsIHRydWUpO1xyXG5cdFx0XHRcdFx0dGhpcy5fY2FzY2FkZUdyaWQoZ3JpZFBvcywgZGltcyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmICghdGhpcy5fZml4VG9HcmlkKSB7XHJcblx0XHRcdFx0dGhpcy5fZHJhZ2dpbmdJdGVtLnNldFBvc2l0aW9uKG5ld0wsIG5ld1QpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLm9uRHJhZy5lbWl0KHRoaXMuX2RyYWdnaW5nSXRlbSk7XHJcblx0XHRcdHRoaXMuX2RyYWdnaW5nSXRlbS5vbkRyYWdFdmVudCgpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfcmVzaXplKGU6IGFueSk6IHZvaWQge1xyXG5cdFx0aWYgKHRoaXMuaXNSZXNpemluZykge1xyXG5cdFx0XHR2YXIgbW91c2VQb3MgPSB0aGlzLl9nZXRNb3VzZVBvc2l0aW9uKGUpO1xyXG5cdFx0XHR2YXIgaXRlbVBvcyA9IHRoaXMuX3Jlc2l6aW5nSXRlbS5nZXRQb3NpdGlvbigpO1xyXG5cdFx0XHR2YXIgaXRlbURpbXMgPSB0aGlzLl9yZXNpemluZ0l0ZW0uZ2V0RGltZW5zaW9ucygpO1xyXG5cdFx0XHR2YXIgbmV3VyA9IHRoaXMuX3Jlc2l6ZURpcmVjdGlvbiA9PSAnaGVpZ2h0JyA/IGl0ZW1EaW1zLndpZHRoIDogKG1vdXNlUG9zLmxlZnQgLSBpdGVtUG9zLmxlZnQgKyAxMCk7XHJcblx0XHRcdHZhciBuZXdIID0gdGhpcy5fcmVzaXplRGlyZWN0aW9uID09ICd3aWR0aCcgPyBpdGVtRGltcy5oZWlnaHQgOiAobW91c2VQb3MudG9wIC0gaXRlbVBvcy50b3AgKyAxMCk7XHJcblxyXG5cdFx0XHRpZiAobmV3VyA8IHRoaXMubWluV2lkdGgpXHJcblx0XHRcdFx0bmV3VyA9IHRoaXMubWluV2lkdGg7XHJcblx0XHRcdGlmIChuZXdIIDwgdGhpcy5taW5IZWlnaHQpXHJcblx0XHRcdFx0bmV3SCA9IHRoaXMubWluSGVpZ2h0O1xyXG5cdFx0XHRpZiAobmV3VyA8IHRoaXMuX3Jlc2l6aW5nSXRlbS5taW5XaWR0aClcclxuXHRcdFx0XHRuZXdXID0gdGhpcy5fcmVzaXppbmdJdGVtLm1pbldpZHRoO1xyXG5cdFx0XHRpZiAobmV3SCA8IHRoaXMuX3Jlc2l6aW5nSXRlbS5taW5IZWlnaHQpXHJcblx0XHRcdFx0bmV3SCA9IHRoaXMuX3Jlc2l6aW5nSXRlbS5taW5IZWlnaHQ7XHJcblxyXG5cdFx0XHR2YXIgY2FsY1NpemUgPSB0aGlzLl9jYWxjdWxhdGVHcmlkU2l6ZShuZXdXLCBuZXdIKTtcclxuXHRcdFx0dmFyIGl0ZW1TaXplID0gdGhpcy5fcmVzaXppbmdJdGVtLmdldFNpemUoKTtcclxuXHRcdFx0dmFyIGlHcmlkUG9zID0gdGhpcy5fcmVzaXppbmdJdGVtLmdldEdyaWRQb3NpdGlvbigpO1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLl9pc1dpdGhpbkJvdW5kc1goaUdyaWRQb3MsIGNhbGNTaXplKSlcclxuXHRcdFx0XHRjYWxjU2l6ZS54ID0gKHRoaXMuX21heENvbHMgLSBpR3JpZFBvcy5jb2wpICsgMTtcclxuXHJcblx0XHRcdGlmICghdGhpcy5faXNXaXRoaW5Cb3VuZHNZKGlHcmlkUG9zLCBjYWxjU2l6ZSkpXHJcblx0XHRcdFx0Y2FsY1NpemUueSA9ICh0aGlzLl9tYXhSb3dzIC0gaUdyaWRQb3Mucm93KSArIDE7XHJcblxyXG5cdFx0XHRjYWxjU2l6ZSA9IHRoaXMuX3Jlc2l6aW5nSXRlbS5maXhSZXNpemUoY2FsY1NpemUpO1xyXG5cdFx0XHRcclxuXHRcdFx0aWYgKGNhbGNTaXplLnggIT0gaXRlbVNpemUueCB8fCBjYWxjU2l6ZS55ICE9IGl0ZW1TaXplLnkpIHtcclxuXHRcdFx0XHR0aGlzLl9yZXNpemluZ0l0ZW0uc2V0U2l6ZShjYWxjU2l6ZSwgZmFsc2UpO1xyXG5cdFx0XHRcdHRoaXMuX3BsYWNlaG9sZGVyUmVmLmluc3RhbmNlLnNldFNpemUoY2FsY1NpemUpO1xyXG5cclxuXHRcdFx0XHRpZiAoWyd1cCcsICdkb3duJywgJ2xlZnQnLCAncmlnaHQnXS5pbmRleE9mKHRoaXMuY2FzY2FkZSkgPj0gMCkge1xyXG5cdFx0XHRcdFx0dGhpcy5fZml4R3JpZENvbGxpc2lvbnMoaUdyaWRQb3MsIGNhbGNTaXplLCB0cnVlKTtcclxuXHRcdFx0XHRcdHRoaXMuX2Nhc2NhZGVHcmlkKGlHcmlkUG9zLCBjYWxjU2l6ZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuX2ZpeFRvR3JpZClcclxuXHRcdFx0XHR0aGlzLl9yZXNpemluZ0l0ZW0uc2V0RGltZW5zaW9ucyhuZXdXLCBuZXdIKTtcclxuXHJcblx0XHRcdHZhciBiaWdHcmlkID0gdGhpcy5fbWF4R3JpZFNpemUoaXRlbVBvcy5sZWZ0ICsgbmV3VyArICgyICogZS5tb3ZlbWVudFgpLCBpdGVtUG9zLnRvcCArIG5ld0ggKyAoMiAqIGUubW92ZW1lbnRZKSk7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5fcmVzaXplRGlyZWN0aW9uID09ICdoZWlnaHQnKSBiaWdHcmlkLnggPSBpR3JpZFBvcy5jb2wgKyBpdGVtU2l6ZS54O1xyXG5cdFx0XHRpZiAodGhpcy5fcmVzaXplRGlyZWN0aW9uID09ICd3aWR0aCcpIGJpZ0dyaWQueSA9IGlHcmlkUG9zLnJvdyArIGl0ZW1TaXplLnk7XHJcblxyXG5cdFx0XHR0aGlzLm9uUmVzaXplLmVtaXQodGhpcy5fcmVzaXppbmdJdGVtKTtcclxuXHRcdFx0dGhpcy5fcmVzaXppbmdJdGVtLm9uUmVzaXplRXZlbnQoKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX29uTW91c2VVcChlOiBhbnkpOiBib29sZWFuIHtcclxuXHRcdGlmICh0aGlzLmlzRHJhZ2dpbmcpIHtcclxuXHRcdFx0dGhpcy5fZHJhZ1N0b3AoZSk7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH0gZWxzZSBpZiAodGhpcy5pc1Jlc2l6aW5nKSB7XHJcblx0XHRcdHRoaXMuX3Jlc2l6ZVN0b3AoZSk7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gdHJ1ZTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX2RyYWdTdG9wKGU6IGFueSk6IHZvaWQge1xyXG5cdFx0aWYgKHRoaXMuaXNEcmFnZ2luZykge1xyXG5cdFx0XHR0aGlzLmlzRHJhZ2dpbmcgPSBmYWxzZTtcclxuXHJcblx0XHRcdHZhciBpdGVtUG9zID0gdGhpcy5fZHJhZ2dpbmdJdGVtLmdldEdyaWRQb3NpdGlvbigpO1xyXG5cclxuXHRcdFx0dGhpcy5fZHJhZ2dpbmdJdGVtLnNhdmVQb3NpdGlvbihpdGVtUG9zKTtcclxuXHRcdFx0dGhpcy5fYWRkVG9HcmlkKHRoaXMuX2RyYWdnaW5nSXRlbSk7XHJcblxyXG5cdFx0XHR0aGlzLl9jYXNjYWRlR3JpZCgpO1xyXG5cclxuXHRcdFx0dGhpcy5fZHJhZ2dpbmdJdGVtLnN0b3BNb3ZpbmcoKTtcclxuXHRcdFx0dGhpcy5fZHJhZ2dpbmdJdGVtLm9uRHJhZ1N0b3BFdmVudCgpO1xyXG5cdFx0XHR0aGlzLm9uRHJhZ1N0b3AuZW1pdCh0aGlzLl9kcmFnZ2luZ0l0ZW0pO1xyXG5cdFx0XHR0aGlzLl9kcmFnZ2luZ0l0ZW0gPSBudWxsO1xyXG5cdFx0XHR0aGlzLl9wb3NPZmZzZXQgPSBudWxsO1xyXG5cdFx0XHR0aGlzLl9wbGFjZWhvbGRlclJlZi5kZXN0cm95KCk7XHJcblxyXG5cdFx0XHR0aGlzLm9uSXRlbUNoYW5nZS5lbWl0KHRoaXMuX2l0ZW1zLm1hcCgoaXRlbTogTmdHcmlkSXRlbSkgPT4gaXRlbS5nZXRFdmVudE91dHB1dCgpKSk7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5fem9vbU9uRHJhZykge1xyXG5cdFx0XHRcdHRoaXMuX3Jlc2V0Wm9vbSgpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF9yZXNpemVTdG9wKGU6IGFueSk6IHZvaWQge1xyXG5cdFx0aWYgKHRoaXMuaXNSZXNpemluZykge1xyXG5cdFx0XHR0aGlzLmlzUmVzaXppbmcgPSBmYWxzZTtcclxuXHJcblx0XHRcdHZhciBpdGVtRGltcyA9IHRoaXMuX3Jlc2l6aW5nSXRlbS5nZXRTaXplKCk7XHJcblxyXG5cdFx0XHR0aGlzLl9yZXNpemluZ0l0ZW0uc2V0U2l6ZShpdGVtRGltcyk7XHJcblx0XHRcdHRoaXMuX2FkZFRvR3JpZCh0aGlzLl9yZXNpemluZ0l0ZW0pO1xyXG5cclxuXHRcdFx0dGhpcy5fY2FzY2FkZUdyaWQoKTtcclxuXHJcblx0XHRcdHRoaXMuX3Jlc2l6aW5nSXRlbS5zdG9wTW92aW5nKCk7XHJcblx0XHRcdHRoaXMuX3Jlc2l6aW5nSXRlbS5vblJlc2l6ZVN0b3BFdmVudCgpO1xyXG5cdFx0XHR0aGlzLm9uUmVzaXplU3RvcC5lbWl0KHRoaXMuX3Jlc2l6aW5nSXRlbSk7XHJcblx0XHRcdHRoaXMuX3Jlc2l6aW5nSXRlbSA9IG51bGw7XHJcblx0XHRcdHRoaXMuX3Jlc2l6ZURpcmVjdGlvbiA9IG51bGw7XHJcblx0XHRcdHRoaXMuX3BsYWNlaG9sZGVyUmVmLmRlc3Ryb3koKTtcclxuXHJcblx0XHRcdHRoaXMub25JdGVtQ2hhbmdlLmVtaXQodGhpcy5faXRlbXMubWFwKChpdGVtOiBOZ0dyaWRJdGVtKSA9PiBpdGVtLmdldEV2ZW50T3V0cHV0KCkpKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX21heEdyaWRTaXplKHc6IG51bWJlciwgaDogbnVtYmVyKTogTmdHcmlkSXRlbVNpemUge1xyXG5cdFx0dmFyIHNpemV4ID0gTWF0aC5jZWlsKHcgLyAodGhpcy5jb2xXaWR0aCArIHRoaXMubWFyZ2luTGVmdCArIHRoaXMubWFyZ2luUmlnaHQpKTtcclxuXHRcdHZhciBzaXpleSA9IE1hdGguY2VpbChoIC8gKHRoaXMucm93SGVpZ2h0ICsgdGhpcy5tYXJnaW5Ub3AgKyB0aGlzLm1hcmdpbkJvdHRvbSkpO1xyXG5cdFx0cmV0dXJuIHsgJ3gnOiBzaXpleCwgJ3knOiBzaXpleSB9O1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfY2FsY3VsYXRlR3JpZFNpemUod2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpOiBOZ0dyaWRJdGVtU2l6ZSB7XHJcblx0XHR3aWR0aCArPSB0aGlzLm1hcmdpbkxlZnQgKyB0aGlzLm1hcmdpblJpZ2h0O1xyXG5cdFx0aGVpZ2h0ICs9IHRoaXMubWFyZ2luVG9wICsgdGhpcy5tYXJnaW5Cb3R0b207XHJcblxyXG5cdFx0dmFyIHNpemV4ID0gTWF0aC5tYXgodGhpcy5taW5Db2xzLCBNYXRoLnJvdW5kKHdpZHRoIC8gKHRoaXMuY29sV2lkdGggKyB0aGlzLm1hcmdpbkxlZnQgKyB0aGlzLm1hcmdpblJpZ2h0KSkpO1xyXG5cdFx0dmFyIHNpemV5ID0gTWF0aC5tYXgodGhpcy5taW5Sb3dzLCBNYXRoLnJvdW5kKGhlaWdodCAvICh0aGlzLnJvd0hlaWdodCArIHRoaXMubWFyZ2luVG9wICsgdGhpcy5tYXJnaW5Cb3R0b20pKSk7XHJcblxyXG5cdFx0aWYgKCF0aGlzLl9pc1dpdGhpbkJvdW5kc1goeyBjb2w6IDEsIHJvdzogMSB9LCB7IHg6IHNpemV4LCB5OiBzaXpleSB9KSkgc2l6ZXggPSB0aGlzLl9tYXhDb2xzO1xyXG5cdFx0aWYgKCF0aGlzLl9pc1dpdGhpbkJvdW5kc1koeyBjb2w6IDEsIHJvdzogMSB9LCB7IHg6IHNpemV4LCB5OiBzaXpleSB9KSkgc2l6ZXkgPSB0aGlzLl9tYXhSb3dzO1xyXG5cclxuXHRcdHJldHVybiB7ICd4Jzogc2l6ZXgsICd5Jzogc2l6ZXkgfTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX2NhbGN1bGF0ZUdyaWRQb3NpdGlvbihsZWZ0OiBudW1iZXIsIHRvcDogbnVtYmVyKTogTmdHcmlkSXRlbVBvc2l0aW9uIHtcclxuXHRcdHZhciBjb2wgPSBNYXRoLm1heCgxLCBNYXRoLnJvdW5kKGxlZnQgLyAodGhpcy5jb2xXaWR0aCArIHRoaXMubWFyZ2luTGVmdCArIHRoaXMubWFyZ2luUmlnaHQpKSArIDEpO1xyXG5cdFx0dmFyIHJvdyA9IE1hdGgubWF4KDEsIE1hdGgucm91bmQodG9wIC8gKHRoaXMucm93SGVpZ2h0ICsgdGhpcy5tYXJnaW5Ub3AgKyB0aGlzLm1hcmdpbkJvdHRvbSkpICsgMSk7XHJcblxyXG5cdFx0aWYgKCF0aGlzLl9pc1dpdGhpbkJvdW5kc1goeyBjb2w6IGNvbCwgcm93OiByb3cgfSwgeyB4OiAxLCB5OiAxIH0pKSBjb2wgPSB0aGlzLl9tYXhDb2xzO1xyXG5cdFx0aWYgKCF0aGlzLl9pc1dpdGhpbkJvdW5kc1koeyBjb2w6IGNvbCwgcm93OiByb3cgfSwgeyB4OiAxLCB5OiAxIH0pKSByb3cgPSB0aGlzLl9tYXhSb3dzO1xyXG5cclxuXHRcdHJldHVybiB7ICdjb2wnOiBjb2wsICdyb3cnOiByb3cgfTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX2hhc0dyaWRDb2xsaXNpb24ocG9zOiBOZ0dyaWRJdGVtUG9zaXRpb24sIGRpbXM6IE5nR3JpZEl0ZW1TaXplKTogYm9vbGVhbiB7XHJcblx0XHR2YXIgcG9zaXRpb25zID0gdGhpcy5fZ2V0Q29sbGlzaW9ucyhwb3MsIGRpbXMpO1xyXG5cclxuXHRcdGlmIChwb3NpdGlvbnMgPT0gbnVsbCB8fCBwb3NpdGlvbnMubGVuZ3RoID09IDApIHJldHVybiBmYWxzZTtcclxuXHJcblx0XHRyZXR1cm4gcG9zaXRpb25zLnNvbWUoKHY6IE5nR3JpZEl0ZW0pID0+IHtcclxuXHRcdFx0cmV0dXJuICEodiA9PT0gbnVsbCk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX2dldENvbGxpc2lvbnMocG9zOiBOZ0dyaWRJdGVtUG9zaXRpb24sIGRpbXM6IE5nR3JpZEl0ZW1TaXplKTogQXJyYXk8TmdHcmlkSXRlbT4ge1xyXG5cdFx0Y29uc3QgcmV0dXJuczogQXJyYXk8TmdHcmlkSXRlbT4gPSBbXTtcclxuXHRcdFxyXG5cdFx0Zm9yIChsZXQgajogbnVtYmVyID0gMDsgaiA8IGRpbXMueTsgaisrKSB7XHJcblx0XHRcdGlmICh0aGlzLl9pdGVtR3JpZFtwb3Mucm93ICsgal0gIT0gbnVsbCkge1xyXG5cdFx0XHRcdGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCBkaW1zLng7IGkrKykge1xyXG5cdFx0XHRcdFx0aWYgKHRoaXMuX2l0ZW1HcmlkW3Bvcy5yb3cgKyBqXVtwb3MuY29sICsgaV0gIT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0XHRjb25zdCBpdGVtOiBOZ0dyaWRJdGVtID0gdGhpcy5faXRlbUdyaWRbcG9zLnJvdyArIGpdW3Bvcy5jb2wgKyBpXTtcclxuXHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdGlmIChyZXR1cm5zLmluZGV4T2YoaXRlbSkgPCAwKVxyXG5cdFx0XHRcdFx0XHRcdHJldHVybnMucHVzaChpdGVtKTtcclxuXHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdGNvbnN0IGl0ZW1Qb3M6IE5nR3JpZEl0ZW1Qb3NpdGlvbiA9IGl0ZW0uZ2V0R3JpZFBvc2l0aW9uKCk7XHJcblx0XHRcdFx0XHRcdGNvbnN0IGl0ZW1EaW1zOiBOZ0dyaWRJdGVtU2l6ZSA9IGl0ZW0uZ2V0U2l6ZSgpO1xyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0aSA9IGl0ZW1Qb3MuY29sICsgaXRlbURpbXMueCAtIHBvcy5jb2w7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHJldHVybnM7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF9maXhHcmlkQ29sbGlzaW9ucyhwb3M6IE5nR3JpZEl0ZW1Qb3NpdGlvbiwgZGltczogTmdHcmlkSXRlbVNpemUsIHNob3VsZFNhdmU6IGJvb2xlYW4gPSBmYWxzZSk6IHZvaWQge1xyXG5cdFx0d2hpbGUgKHRoaXMuX2hhc0dyaWRDb2xsaXNpb24ocG9zLCBkaW1zKSkge1xyXG5cdFx0XHRjb25zdCBjb2xsaXNpb25zOiBBcnJheTxOZ0dyaWRJdGVtPiA9IHRoaXMuX2dldENvbGxpc2lvbnMocG9zLCBkaW1zKTtcclxuXHJcblx0XHRcdHRoaXMuX3JlbW92ZUZyb21HcmlkKGNvbGxpc2lvbnNbMF0pO1xyXG5cclxuXHRcdFx0Y29uc3QgaXRlbVBvczogTmdHcmlkSXRlbVBvc2l0aW9uID0gY29sbGlzaW9uc1swXS5nZXRHcmlkUG9zaXRpb24oKTtcclxuXHRcdFx0Y29uc3QgaXRlbURpbXM6IE5nR3JpZEl0ZW1TaXplID0gY29sbGlzaW9uc1swXS5nZXRTaXplKCk7XHJcblxyXG5cdFx0XHRzd2l0Y2ggKHRoaXMuY2FzY2FkZSkge1xyXG5cdFx0XHRcdGNhc2UgJ3VwJzpcclxuXHRcdFx0XHRjYXNlICdkb3duJzpcclxuXHRcdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdFx0Y29uc3Qgb2xkUm93OiBudW1iZXIgPSBpdGVtUG9zLnJvdztcclxuXHRcdFx0XHRcdGl0ZW1Qb3Mucm93ID0gcG9zLnJvdyArIGRpbXMueTtcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0aWYgKCF0aGlzLl9pc1dpdGhpbkJvdW5kc1koaXRlbVBvcywgaXRlbURpbXMpKSB7XHJcblx0XHRcdFx0XHRcdGl0ZW1Qb3MuY29sID0gcG9zLmNvbCArIGRpbXMueDtcclxuXHRcdFx0XHRcdFx0aXRlbVBvcy5yb3cgPSBvbGRSb3c7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlICdsZWZ0JzpcclxuXHRcdFx0XHRjYXNlICdyaWdodCc6XHJcblx0XHRcdFx0XHRjb25zdCBvbGRDb2w6IG51bWJlciA9IGl0ZW1Qb3MuY29sO1xyXG5cdFx0XHRcdFx0aXRlbVBvcy5jb2wgPSBwb3MuY29sICsgZGltcy54O1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRpZiAoIXRoaXMuX2lzV2l0aGluQm91bmRzWChpdGVtUG9zLCBpdGVtRGltcykpIHtcclxuXHRcdFx0XHRcdFx0aXRlbVBvcy5jb2wgPSBvbGRDb2w7XHJcblx0XHRcdFx0XHRcdGl0ZW1Qb3Mucm93ID0gcG9zLnJvdyArIGRpbXMueTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAoc2hvdWxkU2F2ZSkge1xyXG5cdFx0XHRcdGNvbGxpc2lvbnNbMF0uc2F2ZVBvc2l0aW9uKGl0ZW1Qb3MpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGNvbGxpc2lvbnNbMF0uc2V0R3JpZFBvc2l0aW9uKGl0ZW1Qb3MpO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHR0aGlzLl9maXhHcmlkQ29sbGlzaW9ucyhpdGVtUG9zLCBpdGVtRGltcywgc2hvdWxkU2F2ZSk7XHJcblx0XHRcdHRoaXMuX2FkZFRvR3JpZChjb2xsaXNpb25zWzBdKTtcclxuXHRcdFx0Y29sbGlzaW9uc1swXS5vbkNhc2NhZGVFdmVudCgpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRwcml2YXRlIF9saW1pdEdyaWQobWF4Q29sczogbnVtYmVyKTogdm9pZCB7XHJcblx0XHRjb25zdCBpdGVtczogQXJyYXk8TmdHcmlkSXRlbT4gPSB0aGlzLl9pdGVtcy5zbGljZSgpO1xyXG5cdFx0XHJcblx0XHRpdGVtcy5zb3J0KChhOiBOZ0dyaWRJdGVtLCBiOiBOZ0dyaWRJdGVtKSA9PiB7XHJcblx0XHRcdGxldCBhUG9zOiBOZ0dyaWRJdGVtUG9zaXRpb24gPSBhLmdldFNhdmVkUG9zaXRpb24oKTtcclxuXHRcdFx0bGV0IGJQb3M6IE5nR3JpZEl0ZW1Qb3NpdGlvbiA9IGIuZ2V0U2F2ZWRQb3NpdGlvbigpO1xyXG5cclxuXHRcdFx0aWYgKGFQb3Mucm93ID09IGJQb3Mucm93KSB7XHJcblx0XHRcdFx0cmV0dXJuIGFQb3MuY29sID09IGJQb3MuY29sID8gMCA6IChhUG9zLmNvbCA8IGJQb3MuY29sID8gLTEgOiAxKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRyZXR1cm4gYVBvcy5yb3cgPCBiUG9zLnJvdyA/IC0xIDogMTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRcclxuXHRcdGNvbnN0IGNvbHVtbk1heDogeyBbY29sOiBudW1iZXJdOiBudW1iZXIgfSA9IHt9O1xyXG5cdFx0Y29uc3QgbGFyZ2VzdEdhcDogeyBbY29sOiBudW1iZXJdOiBudW1iZXIgfSA9IHt9O1xyXG5cdFx0XHJcblx0XHRmb3IgKGxldCBpOiBudW1iZXIgPSAxOyBpIDw9IG1heENvbHM7IGkrKykge1xyXG5cdFx0XHRjb2x1bW5NYXhbaV0gPSAxO1xyXG5cdFx0XHRsYXJnZXN0R2FwW2ldID0gMTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0Y29uc3QgY3VyUG9zOiBOZ0dyaWRJdGVtUG9zaXRpb24gPSB7IGNvbDogMSwgcm93OiAxIH07XHJcblx0XHRsZXQgY3VycmVudFJvdzogbnVtYmVyID0gMTtcclxuXHRcdFxyXG5cdFx0Y29uc3Qgd2lsbENhc2NhZGU6IChpdGVtOiBOZ0dyaWRJdGVtLCBjb2w6IG51bWJlcikgPT4gYm9vbGVhbiA9IChpdGVtOiBOZ0dyaWRJdGVtLCBjb2w6IG51bWJlcikgPT4ge1xyXG5cdFx0XHRmb3IgKGxldCBpOiBudW1iZXIgPSBjb2w7IGkgPCBjb2wgKyBpdGVtLnNpemV4OyBpKyspIHtcclxuXHRcdFx0XHRpZiAoY29sdW1uTWF4W2ldID09IGN1cnJlbnRSb3cpIHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9O1xyXG5cdFx0XHJcblx0XHRpbnRlcmZhY2UgR3JpZEJsb2NrIHtcclxuXHRcdFx0c3RhcnQ6IG51bWJlcjtcclxuXHRcdFx0ZW5kOiBudW1iZXI7XHJcblx0XHRcdGxlbmd0aDogbnVtYmVyO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHR3aGlsZSAoaXRlbXMubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRjb25zdCBjb2x1bW5zOiBBcnJheTxHcmlkQmxvY2s+ID0gW107XHJcblx0XHRcdGxldCBuZXdCbG9jazogR3JpZEJsb2NrID0ge1xyXG5cdFx0XHRcdHN0YXJ0OiAxLFxyXG5cdFx0XHRcdGVuZDogMSxcclxuXHRcdFx0XHRsZW5ndGg6IDAsXHJcblx0XHRcdH07XHJcblx0XHRcdFxyXG5cdFx0XHRmb3IgKGxldCBjb2w6IG51bWJlciA9IDE7IGNvbCA8PSBtYXhDb2xzOyBjb2wrKykge1xyXG5cdFx0XHRcdGlmIChjb2x1bW5NYXhbY29sXSA8PSBjdXJyZW50Um93KSB7XHJcblx0XHRcdFx0XHRpZiAobmV3QmxvY2subGVuZ3RoID09IDApIHtcclxuXHRcdFx0XHRcdFx0bmV3QmxvY2suc3RhcnQgPSBjb2w7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdG5ld0Jsb2NrLmxlbmd0aCsrO1xyXG5cdFx0XHRcdFx0bmV3QmxvY2suZW5kID0gY29sICsgMTtcclxuXHRcdFx0XHR9IGVsc2UgaWYgKG5ld0Jsb2NrLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdGNvbHVtbnMucHVzaChuZXdCbG9jayk7XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdG5ld0Jsb2NrID0ge1xyXG5cdFx0XHRcdFx0XHRzdGFydDogY29sLFxyXG5cdFx0XHRcdFx0XHRlbmQ6IGNvbCxcclxuXHRcdFx0XHRcdFx0bGVuZ3RoOiAwLFxyXG5cdFx0XHRcdFx0fTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdGlmIChuZXdCbG9jay5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0Y29sdW1ucy5wdXNoKG5ld0Jsb2NrKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0bGV0IHRlbXBDb2x1bW5zOiBBcnJheTxudW1iZXI+ID0gY29sdW1ucy5tYXAoKGJsb2NrOiBHcmlkQmxvY2spID0+IGJsb2NrLmxlbmd0aCk7XHJcblx0XHRcdGNvbnN0IGN1cnJlbnRJdGVtczogQXJyYXk8TmdHcmlkSXRlbT4gPSBbXTtcclxuXHRcdFx0XHJcblx0XHRcdHdoaWxlIChpdGVtcy5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0Y29uc3QgaXRlbSA9IGl0ZW1zWzBdO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGlmIChpdGVtLnJvdyA+IGN1cnJlbnRSb3cpIGJyZWFrO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGxldCBmaXRzOiBib29sZWFuID0gZmFsc2U7XHJcblx0XHRcdFx0Zm9yIChsZXQgeCBpbiB0ZW1wQ29sdW1ucykge1xyXG5cdFx0XHRcdFx0aWYgKGl0ZW0uc2l6ZXggPD0gdGVtcENvbHVtbnNbeF0pIHtcclxuXHRcdFx0XHRcdFx0dGVtcENvbHVtbnNbeF0gLT0gaXRlbS5zaXpleDtcclxuXHRcdFx0XHRcdFx0Zml0cyA9IHRydWU7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0fSBlbHNlIGlmIChpdGVtLnNpemV4ID4gdGVtcENvbHVtbnNbeF0pIHtcclxuXHRcdFx0XHRcdFx0dGVtcENvbHVtbnNbeF0gPSAwO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRcclxuXHRcdFx0XHRpZiAoZml0cykge1xyXG5cdFx0XHRcdFx0Y3VycmVudEl0ZW1zLnB1c2goaXRlbXMuc2hpZnQoKSk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0aWYgKGN1cnJlbnRJdGVtcy5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0Y29uc3QgaXRlbVBvc2l0aW9uczogQXJyYXk8bnVtYmVyPiA9IFtdO1xyXG5cdFx0XHRcdGxldCBsYXN0UG9zaXRpb246IG51bWJlciA9IG1heENvbHM7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0Zm9yIChsZXQgaSA9IGN1cnJlbnRJdGVtcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xyXG5cdFx0XHRcdFx0bGV0IG1heFBvc2l0aW9uID0gMTtcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0Zm9yIChsZXQgaiA9IGNvbHVtbnMubGVuZ3RoIC0gMTsgaiA+PSAwOyBqLS0pIHtcclxuXHRcdFx0XHRcdFx0aWYgKGNvbHVtbnNbal0uc3RhcnQgPiBsYXN0UG9zaXRpb24pIGNvbnRpbnVlO1xyXG5cdFx0XHRcdFx0XHRpZiAoY29sdW1uc1tqXS5zdGFydCA+IChtYXhDb2xzIC0gY3VycmVudEl0ZW1zW2ldLnNpemV4KSkgY29udGludWU7XHJcblx0XHRcdFx0XHRcdGlmIChjb2x1bW5zW2pdLmxlbmd0aCA8IGN1cnJlbnRJdGVtc1tpXS5zaXpleCkgY29udGludWU7XHJcblx0XHRcdFx0XHRcdGlmIChsYXN0UG9zaXRpb24gPCBjb2x1bW5zW2pdLmVuZCAmJiAobGFzdFBvc2l0aW9uIC0gY29sdW1uc1tqXS5zdGFydCkgPCBjdXJyZW50SXRlbXNbaV0uc2l6ZXgpIGNvbnRpbnVlO1xyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0bWF4UG9zaXRpb24gPSAobGFzdFBvc2l0aW9uIDwgY29sdW1uc1tqXS5lbmQgPyBsYXN0UG9zaXRpb24gOiBjb2x1bW5zW2pdLmVuZCkgLSBjdXJyZW50SXRlbXNbaV0uc2l6ZXhcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdGl0ZW1Qb3NpdGlvbnNbaV0gPSBNYXRoLm1pbihtYXhQb3NpdGlvbiwgY3VycmVudEl0ZW1zW2ldLnJvdyA9PSBjdXJyZW50Um93ID8gY3VycmVudEl0ZW1zW2ldLmNvbCA6IDEpO1xyXG5cdFx0XHRcdFx0bGFzdFBvc2l0aW9uID0gaXRlbVBvc2l0aW9uc1tpXTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0bGV0IG1pblBvc2l0aW9uOiBudW1iZXIgPSAxO1xyXG5cdFx0XHRcdGxldCBjdXJyZW50SXRlbTogbnVtYmVyID0gMDtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHR3aGlsZSAoY3VycmVudEl0ZW1zLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRcdGNvbnN0IGl0ZW06IE5nR3JpZEl0ZW0gPSBjdXJyZW50SXRlbXMuc2hpZnQoKTtcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0Zm9yIChsZXQgaiA9IDA7IGogPCBjb2x1bW5zLmxlbmd0aDsgaisrKSB7XHJcblx0XHRcdFx0XHRcdGlmIChjb2x1bW5zW2pdLmxlbmd0aCA8IGl0ZW0uc2l6ZXgpIGNvbnRpbnVlO1xyXG5cdFx0XHRcdFx0XHRpZiAobWluUG9zaXRpb24gPiBjb2x1bW5zW2pdLmVuZCkgY29udGludWU7XHJcblx0XHRcdFx0XHRcdGlmIChtaW5Qb3NpdGlvbiA+IGNvbHVtbnNbal0uc3RhcnQgJiYgKGNvbHVtbnNbal0uZW5kIC0gbWluUG9zaXRpb24pIDwgaXRlbS5zaXpleCkgY29udGludWU7XHJcblx0XHRcdFx0XHRcdGlmIChtaW5Qb3NpdGlvbiA8ICBjb2x1bW5zW2pdLnN0YXJ0KSBtaW5Qb3NpdGlvbiA9IGNvbHVtbnNbal0uc3RhcnQ7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRpdGVtLnNldEdyaWRQb3NpdGlvbih7IGNvbDogTWF0aC5tYXgobWluUG9zaXRpb24sIGl0ZW1Qb3NpdGlvbnNbY3VycmVudEl0ZW1dKSwgcm93OiBjdXJyZW50Um93IH0pO1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRtaW5Qb3NpdGlvbiA9IGl0ZW0uY3VycmVudENvbCArIGl0ZW0uc2l6ZXg7XHJcblx0XHRcdFx0XHRjdXJyZW50SXRlbSsrO1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRmb3IgKGxldCBpOiBudW1iZXIgPSBpdGVtLmN1cnJlbnRDb2w7IGkgPCBpdGVtLmN1cnJlbnRDb2wgKyBpdGVtLnNpemV4OyBpKyspIHtcclxuXHRcdFx0XHRcdFx0Y29sdW1uTWF4W2ldID0gaXRlbS5jdXJyZW50Um93ICsgaXRlbS5zaXpleTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSBpZiAoY3VycmVudEl0ZW1zLmxlbmd0aCA9PT0gMCAmJiBjb2x1bW5zLmxlbmd0aCA9PT0gMSAmJiBjb2x1bW5zWzBdLmxlbmd0aCA+PSBtYXhDb2xzKSB7XHQvL1x0T25seSBvbmUgYmxvY2ssIGJ1dCBubyBpdGVtcyBmaXQuIE1lYW5zIHRoZSBuZXh0IGl0ZW0gaXMgdG9vIGxhcmdlXHJcblx0XHRcdFx0Y29uc3QgaXRlbTogTmdHcmlkSXRlbSA9IGl0ZW1zLnNoaWZ0KCk7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0aXRlbS5zZXRHcmlkUG9zaXRpb24oeyBjb2w6IDEsIHJvdzogY3VycmVudFJvdyB9KTtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRmb3IgKGxldCBpOiBudW1iZXIgPSBpdGVtLmN1cnJlbnRDb2w7IGkgPCBpdGVtLmN1cnJlbnRDb2wgKyBpdGVtLnNpemV4OyBpKyspIHtcclxuXHRcdFx0XHRcdGNvbHVtbk1heFtpXSA9IGl0ZW0uY3VycmVudFJvdyArIGl0ZW0uc2l6ZXk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRsZXQgbmV3Um93OiBudW1iZXIgPSAwO1xyXG5cdFx0XHRcclxuXHRcdFx0Zm9yIChsZXQgeCBpbiBjb2x1bW5NYXgpIHtcclxuXHRcdFx0XHRpZiAoY29sdW1uTWF4W3hdID4gY3VycmVudFJvdyAmJiAobmV3Um93ID09IDAgfHwgY29sdW1uTWF4W3hdIDwgbmV3Um93KSkge1xyXG5cdFx0XHRcdFx0bmV3Um93ID0gY29sdW1uTWF4W3hdO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0Y3VycmVudFJvdyA9IG5ld1JvdyA8PSBjdXJyZW50Um93ID8gY3VycmVudFJvdyArIDEgOiBuZXdSb3c7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF9jYXNjYWRlR3JpZChwb3M/OiBOZ0dyaWRJdGVtUG9zaXRpb24sIGRpbXM/OiBOZ0dyaWRJdGVtU2l6ZSwgc2hvdWxkU2F2ZTogYm9vbGVhbiA9IHRydWUpOiB2b2lkIHtcclxuXHRcdGlmICh0aGlzLl9kZXN0cm95ZWQpIHJldHVybjtcclxuXHRcdGlmIChwb3MgJiYgIWRpbXMpIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGNhc2NhZGUgd2l0aCBvbmx5IHBvc2l0aW9uIGFuZCBub3QgZGltZW5zaW9ucycpO1xyXG5cclxuXHRcdGlmICh0aGlzLmlzRHJhZ2dpbmcgJiYgdGhpcy5fZHJhZ2dpbmdJdGVtICYmICFwb3MgJiYgIWRpbXMpIHtcclxuXHRcdFx0cG9zID0gdGhpcy5fZHJhZ2dpbmdJdGVtLmdldEdyaWRQb3NpdGlvbigpO1xyXG5cdFx0XHRkaW1zID0gdGhpcy5fZHJhZ2dpbmdJdGVtLmdldFNpemUoKTtcclxuXHRcdH0gZWxzZSBpZiAodGhpcy5pc1Jlc2l6aW5nICYmIHRoaXMuX3Jlc2l6aW5nSXRlbSAmJiAhcG9zICYmICFkaW1zKSB7XHJcblx0XHRcdHBvcyA9IHRoaXMuX3Jlc2l6aW5nSXRlbS5nZXRHcmlkUG9zaXRpb24oKTtcclxuXHRcdFx0ZGltcyA9IHRoaXMuX3Jlc2l6aW5nSXRlbS5nZXRTaXplKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0c3dpdGNoICh0aGlzLmNhc2NhZGUpIHtcclxuXHRcdFx0Y2FzZSAndXAnOlxyXG5cdFx0XHRjYXNlICdkb3duJzpcclxuXHRcdFx0XHRjb25zdCBsb3dSb3c6IEFycmF5PG51bWJlcj4gPSBbMF07XHJcblxyXG5cdFx0XHRcdGZvciAobGV0IGk6IG51bWJlciA9IDE7IGkgPD0gdGhpcy5fY3VyTWF4Q29sOyBpKyspXHJcblx0XHRcdFx0XHRsb3dSb3dbaV0gPSAxO1xyXG5cclxuXHRcdFx0XHRmb3IgKGxldCByOiBudW1iZXIgPSAxOyByIDw9IHRoaXMuX2N1ck1heFJvdzsgcisrKSB7XHJcblx0XHRcdFx0XHRpZiAodGhpcy5faXRlbUdyaWRbcl0gPT0gdW5kZWZpbmVkKSBjb250aW51ZTtcclxuXHJcblx0XHRcdFx0XHRmb3IgKGxldCBjOiBudW1iZXIgPSAxOyBjIDw9IHRoaXMuX2N1ck1heENvbDsgYysrKSB7XHJcblx0XHRcdFx0XHRcdGlmICh0aGlzLl9pdGVtR3JpZFtyXSA9PSB1bmRlZmluZWQpIGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRpZiAociA8IGxvd1Jvd1tjXSkgY29udGludWU7XHJcblxyXG5cdFx0XHRcdFx0XHRpZiAodGhpcy5faXRlbUdyaWRbcl1bY10gIT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0XHRcdGNvbnN0IGl0ZW06IE5nR3JpZEl0ZW0gPSB0aGlzLl9pdGVtR3JpZFtyXVtjXTtcclxuXHRcdFx0XHRcdFx0XHRpZiAoaXRlbS5pc0ZpeGVkKSBjb250aW51ZTtcclxuXHJcblx0XHRcdFx0XHRcdFx0Y29uc3QgaXRlbURpbXM6IE5nR3JpZEl0ZW1TaXplID0gaXRlbS5nZXRTaXplKCk7XHJcblx0XHRcdFx0XHRcdFx0Y29uc3QgaXRlbVBvczogTmdHcmlkSXRlbVBvc2l0aW9uID0gaXRlbS5nZXRHcmlkUG9zaXRpb24oKTtcclxuXHJcblx0XHRcdFx0XHRcdFx0aWYgKGl0ZW1Qb3MuY29sICE9IGMgfHwgaXRlbVBvcy5yb3cgIT0gcikgY29udGludWU7XHQvL1x0SWYgdGhpcyBpcyBub3QgdGhlIGVsZW1lbnQncyBzdGFydFxyXG5cclxuXHRcdFx0XHRcdFx0XHRsZXQgbG93ZXN0OiBudW1iZXIgPSBsb3dSb3dbY107XHJcblxyXG5cdFx0XHRcdFx0XHRcdGZvciAobGV0IGk6IG51bWJlciA9IDE7IGkgPCBpdGVtRGltcy54OyBpKyspIHtcclxuXHRcdFx0XHRcdFx0XHRcdGxvd2VzdCA9IE1hdGgubWF4KGxvd1Jvd1soYyArIGkpXSwgbG93ZXN0KTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdGlmIChwb3MgJiYgKGMgKyBpdGVtRGltcy54KSA+IHBvcy5jb2wgJiYgYyA8IChwb3MuY29sICsgZGltcy54KSkgeyAgICAgICAgICAvL1x0SWYgb3VyIGVsZW1lbnQgaXMgaW4gb25lIG9mIHRoZSBpdGVtJ3MgY29sdW1uc1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKChyID49IHBvcy5yb3cgJiYgciA8IChwb3Mucm93ICsgZGltcy55KSkgfHwgICAgICAgICAgICAgICAgICAgICAgICAgLy9cdElmIHRoaXMgcm93IGlzIG9jY3VwaWVkIGJ5IG91ciBlbGVtZW50XHJcblx0XHRcdFx0XHRcdFx0XHRcdCgoaXRlbURpbXMueSA+IChwb3Mucm93IC0gbG93ZXN0KSkgJiYgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9cdE9yIHRoZSBpdGVtIGNhbid0IGZpdCBhYm92ZSBvdXIgZWxlbWVudFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdChyID49IChwb3Mucm93ICsgZGltcy55KSAmJiBsb3dlc3QgPCAocG9zLnJvdyArIGRpbXMueSkpKSkgeyAgICAvL1x0XHRBbmQgdGhpcyByb3cgaXMgYmVsb3cgb3VyIGVsZW1lbnQsIGJ1dCB3ZSBoYXZlbid0IGNhdWdodCBpdFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRsb3dlc3QgPSBNYXRoLm1heChsb3dlc3QsIHBvcy5yb3cgKyBkaW1zLnkpOyAgICAgICAgICAgICAgICAgICAgICAgIC8vXHRTZXQgdGhlIGxvd2VzdCByb3cgdG8gYmUgYmVsb3cgaXRcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdFx0Y29uc3QgbmV3UG9zOiBOZ0dyaWRJdGVtUG9zaXRpb24gPSB7IGNvbDogYywgcm93OiBsb3dlc3QgfTtcclxuXHRcdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0XHRpZiAobG93ZXN0ICE9IGl0ZW1Qb3Mucm93ICYmIHRoaXMuX2lzV2l0aGluQm91bmRzWShuZXdQb3MsIGl0ZW1EaW1zKSkge1x0Ly9cdElmIHRoZSBpdGVtIGlzIG5vdCBhbHJlYWR5IG9uIHRoaXMgcm93IG1vdmUgaXQgdXBcclxuXHRcdFx0XHRcdFx0XHRcdHRoaXMuX3JlbW92ZUZyb21HcmlkKGl0ZW0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoc2hvdWxkU2F2ZSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpdGVtLnNhdmVQb3NpdGlvbihuZXdQb3MpO1xyXG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aXRlbS5zZXRHcmlkUG9zaXRpb24obmV3UG9zKTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRcdFx0aXRlbS5vbkNhc2NhZGVFdmVudCgpO1xyXG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5fYWRkVG9HcmlkKGl0ZW0pO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0Zm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IGl0ZW1EaW1zLng7IGkrKykge1xyXG5cdFx0XHRcdFx0XHRcdFx0bG93Um93W2MgKyBpXSA9IGxvd2VzdCArIGl0ZW1EaW1zLnk7XHQvL1x0VXBkYXRlIHRoZSBsb3dlc3Qgcm93IHRvIGJlIGJlbG93IHRoZSBpdGVtXHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdsZWZ0JzpcclxuXHRcdFx0Y2FzZSAncmlnaHQnOlxyXG5cdFx0XHRcdGNvbnN0IGxvd0NvbDogQXJyYXk8bnVtYmVyPiA9IFswXTtcclxuXHJcblx0XHRcdFx0Zm9yIChsZXQgaTogbnVtYmVyID0gMTsgaSA8PSB0aGlzLl9jdXJNYXhSb3c7IGkrKylcclxuXHRcdFx0XHRcdGxvd0NvbFtpXSA9IDE7XHJcblxyXG5cdFx0XHRcdGZvciAobGV0IHI6IG51bWJlciA9IDE7IHIgPD0gdGhpcy5fY3VyTWF4Um93OyByKyspIHtcclxuXHRcdFx0XHRcdGlmICh0aGlzLl9pdGVtR3JpZFtyXSA9PSB1bmRlZmluZWQpIGNvbnRpbnVlO1xyXG5cclxuXHRcdFx0XHRcdGZvciAobGV0IGM6IG51bWJlciA9IDE7IGMgPD0gdGhpcy5fY3VyTWF4Q29sOyBjKyspIHtcclxuXHRcdFx0XHRcdFx0aWYgKHRoaXMuX2l0ZW1HcmlkW3JdID09IHVuZGVmaW5lZCkgYnJlYWs7XHJcblx0XHRcdFx0XHRcdGlmIChjIDwgbG93Q29sW3JdKSBjb250aW51ZTtcclxuXHJcblx0XHRcdFx0XHRcdGlmICh0aGlzLl9pdGVtR3JpZFtyXVtjXSAhPSBudWxsKSB7XHJcblx0XHRcdFx0XHRcdFx0Y29uc3QgaXRlbTogTmdHcmlkSXRlbSA9IHRoaXMuX2l0ZW1HcmlkW3JdW2NdO1xyXG5cdFx0XHRcdFx0XHRcdGNvbnN0IGl0ZW1EaW1zOiBOZ0dyaWRJdGVtU2l6ZSA9IGl0ZW0uZ2V0U2l6ZSgpO1xyXG5cdFx0XHRcdFx0XHRcdGNvbnN0IGl0ZW1Qb3M6IE5nR3JpZEl0ZW1Qb3NpdGlvbiA9IGl0ZW0uZ2V0R3JpZFBvc2l0aW9uKCk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdGlmIChpdGVtUG9zLmNvbCAhPSBjIHx8IGl0ZW1Qb3Mucm93ICE9IHIpIGNvbnRpbnVlO1x0Ly9cdElmIHRoaXMgaXMgbm90IHRoZSBlbGVtZW50J3Mgc3RhcnRcclxuXHJcblx0XHRcdFx0XHRcdFx0bGV0IGxvd2VzdDogbnVtYmVyID0gbG93Q29sW3JdO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRmb3IgKGxldCBpOiBudW1iZXIgPSAxOyBpIDwgaXRlbURpbXMueTsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRsb3dlc3QgPSBNYXRoLm1heChsb3dDb2xbKHIgKyBpKV0sIGxvd2VzdCk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRpZiAocG9zICYmIChyICsgaXRlbURpbXMueSkgPiBwb3Mucm93ICYmIHIgPCAocG9zLnJvdyArIGRpbXMueSkpIHsgICAgICAgICAgLy9cdElmIG91ciBlbGVtZW50IGlzIGluIG9uZSBvZiB0aGUgaXRlbSdzIHJvd3NcclxuXHRcdFx0XHRcdFx0XHRcdGlmICgoYyA+PSBwb3MuY29sICYmIGMgPCAocG9zLmNvbCArIGRpbXMueCkpIHx8ICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHRJZiB0aGlzIGNvbCBpcyBvY2N1cGllZCBieSBvdXIgZWxlbWVudFxyXG5cdFx0XHRcdFx0XHRcdFx0XHQoKGl0ZW1EaW1zLnggPiAocG9zLmNvbCAtIGxvd2VzdCkpICYmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHRPciB0aGUgaXRlbSBjYW4ndCBmaXQgYWJvdmUgb3VyIGVsZW1lbnRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQoYyA+PSAocG9zLmNvbCArIGRpbXMueCkgJiYgbG93ZXN0IDwgKHBvcy5jb2wgKyBkaW1zLngpKSkpIHsgICAgLy9cdFx0QW5kIHRoaXMgY29sIGlzIGJlbG93IG91ciBlbGVtZW50LCBidXQgd2UgaGF2ZW4ndCBjYXVnaHQgaXRcclxuXHRcdFx0XHRcdFx0XHRcdFx0bG93ZXN0ID0gTWF0aC5tYXgobG93ZXN0LCBwb3MuY29sICsgZGltcy54KTsgICAgICAgICAgICAgICAgICAgICAgICAvL1x0U2V0IHRoZSBsb3dlc3QgY29sIHRvIGJlIGJlbG93IGl0XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRcdGNvbnN0IG5ld1BvczogTmdHcmlkSXRlbVBvc2l0aW9uID0geyBjb2w6IGxvd2VzdCwgcm93OiByIH07XHJcblx0XHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdFx0aWYgKGxvd2VzdCAhPSBpdGVtUG9zLmNvbCAmJiB0aGlzLl9pc1dpdGhpbkJvdW5kc1gobmV3UG9zLCBpdGVtRGltcykpIHtcdC8vXHRJZiB0aGUgaXRlbSBpcyBub3QgYWxyZWFkeSBvbiB0aGlzIGNvbCBtb3ZlIGl0IHVwXHJcblx0XHRcdFx0XHRcdFx0XHR0aGlzLl9yZW1vdmVGcm9tR3JpZChpdGVtKTtcclxuXHRcdFx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKHNob3VsZFNhdmUpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aXRlbS5zYXZlUG9zaXRpb24obmV3UG9zKTtcclxuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGl0ZW0uc2V0R3JpZFBvc2l0aW9uKG5ld1Bvcyk7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0XHRcdGl0ZW0ub25DYXNjYWRlRXZlbnQoKTtcclxuXHRcdFx0XHRcdFx0XHRcdHRoaXMuX2FkZFRvR3JpZChpdGVtKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCBpdGVtRGltcy55OyBpKyspIHtcclxuXHRcdFx0XHRcdFx0XHRcdGxvd0NvbFtyICsgaV0gPSBsb3dlc3QgKyBpdGVtRGltcy54O1x0Ly9cdFVwZGF0ZSB0aGUgbG93ZXN0IGNvbCB0byBiZSBiZWxvdyB0aGUgaXRlbVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0ZGVmYXVsdDpcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX2ZpeEdyaWRQb3NpdGlvbihwb3M6IE5nR3JpZEl0ZW1Qb3NpdGlvbiwgZGltczogTmdHcmlkSXRlbVNpemUpOiBOZ0dyaWRJdGVtUG9zaXRpb24ge1xyXG5cdFx0d2hpbGUgKHRoaXMuX2hhc0dyaWRDb2xsaXNpb24ocG9zLCBkaW1zKSB8fCAhdGhpcy5faXNXaXRoaW5Cb3VuZHMocG9zLCBkaW1zKSkge1xyXG5cdFx0XHRpZiAodGhpcy5faGFzR3JpZENvbGxpc2lvbihwb3MsIGRpbXMpKSB7XHJcblx0XHRcdFx0c3dpdGNoICh0aGlzLmNhc2NhZGUpIHtcclxuXHRcdFx0XHRcdGNhc2UgJ3VwJzpcclxuXHRcdFx0XHRcdGNhc2UgJ2Rvd24nOlxyXG5cdFx0XHRcdFx0ZGVmYXVsdDpcclxuXHRcdFx0XHRcdFx0cG9zLnJvdysrO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgJ2xlZnQnOlxyXG5cdFx0XHRcdFx0Y2FzZSAncmlnaHQnOlxyXG5cdFx0XHRcdFx0XHRwb3MuY29sKys7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHJcblx0XHRcdGlmICghdGhpcy5faXNXaXRoaW5Cb3VuZHNZKHBvcywgZGltcykpIHtcclxuXHRcdFx0XHRwb3MuY29sKys7XHJcblx0XHRcdFx0cG9zLnJvdyA9IDE7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKCF0aGlzLl9pc1dpdGhpbkJvdW5kc1gocG9zLCBkaW1zKSkge1xyXG5cdFx0XHRcdHBvcy5yb3crKztcclxuXHRcdFx0XHRwb3MuY29sID0gMTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHBvcztcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX2lzV2l0aGluQm91bmRzWChwb3M6IE5nR3JpZEl0ZW1Qb3NpdGlvbiwgZGltczogTmdHcmlkSXRlbVNpemUpIHtcclxuXHRcdHJldHVybiAodGhpcy5fbWF4Q29scyA9PSAwIHx8IChwb3MuY29sICsgZGltcy54IC0gMSkgPD0gdGhpcy5fbWF4Q29scyk7XHJcblx0fVxyXG5cdHByaXZhdGUgX2lzV2l0aGluQm91bmRzWShwb3M6IE5nR3JpZEl0ZW1Qb3NpdGlvbiwgZGltczogTmdHcmlkSXRlbVNpemUpIHtcclxuXHRcdHJldHVybiAodGhpcy5fbWF4Um93cyA9PSAwIHx8IChwb3Mucm93ICsgZGltcy55IC0gMSkgPD0gdGhpcy5fbWF4Um93cyk7XHJcblx0fVxyXG5cdHByaXZhdGUgX2lzV2l0aGluQm91bmRzKHBvczogTmdHcmlkSXRlbVBvc2l0aW9uLCBkaW1zOiBOZ0dyaWRJdGVtU2l6ZSkge1xyXG5cdFx0cmV0dXJuIHRoaXMuX2lzV2l0aGluQm91bmRzWChwb3MsIGRpbXMpICYmIHRoaXMuX2lzV2l0aGluQm91bmRzWShwb3MsIGRpbXMpO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfYWRkVG9HcmlkKGl0ZW06IE5nR3JpZEl0ZW0pOiB2b2lkIHtcclxuXHRcdGxldCBwb3M6IE5nR3JpZEl0ZW1Qb3NpdGlvbiA9IGl0ZW0uZ2V0R3JpZFBvc2l0aW9uKCk7XHJcblx0XHRjb25zdCBkaW1zOiBOZ0dyaWRJdGVtU2l6ZSA9IGl0ZW0uZ2V0U2l6ZSgpO1xyXG5cclxuXHRcdGlmICh0aGlzLl9oYXNHcmlkQ29sbGlzaW9uKHBvcywgZGltcykpIHtcclxuXHRcdFx0dGhpcy5fZml4R3JpZENvbGxpc2lvbnMocG9zLCBkaW1zKTtcclxuXHRcdFx0cG9zID0gaXRlbS5nZXRHcmlkUG9zaXRpb24oKTtcclxuXHRcdH1cclxuXHJcblx0XHRmb3IgKGxldCBqOiBudW1iZXIgPSAwOyBqIDwgZGltcy55OyBqKyspIHtcclxuXHRcdFx0aWYgKHRoaXMuX2l0ZW1HcmlkW3Bvcy5yb3cgKyBqXSA9PSBudWxsKSB0aGlzLl9pdGVtR3JpZFtwb3Mucm93ICsgal0gPSB7fTtcclxuXHRcdFx0XHJcblx0XHRcdGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCBkaW1zLng7IGkrKykge1xyXG5cdFx0XHRcdHRoaXMuX2l0ZW1HcmlkW3Bvcy5yb3cgKyBqXVtwb3MuY29sICsgaV0gPSBpdGVtO1xyXG5cclxuXHRcdFx0XHR0aGlzLl91cGRhdGVTaXplKHBvcy5jb2wgKyBkaW1zLnggLSAxLCBwb3Mucm93ICsgZGltcy55IC0gMSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX3JlbW92ZUZyb21HcmlkKGl0ZW06IE5nR3JpZEl0ZW0pOiB2b2lkIHtcclxuXHRcdGZvciAobGV0IHkgaW4gdGhpcy5faXRlbUdyaWQpXHJcblx0XHRcdGZvciAobGV0IHggaW4gdGhpcy5faXRlbUdyaWRbeV0pXHJcblx0XHRcdFx0aWYgKHRoaXMuX2l0ZW1HcmlkW3ldW3hdID09IGl0ZW0pXHJcblx0XHRcdFx0XHRkZWxldGUgdGhpcy5faXRlbUdyaWRbeV1beF07XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF91cGRhdGVTaXplKGNvbD86IG51bWJlciwgcm93PzogbnVtYmVyKTogdm9pZCB7XHJcblx0XHRpZiAodGhpcy5fZGVzdHJveWVkKSByZXR1cm47XHJcblx0XHRjb2wgPSAoY29sID09IHVuZGVmaW5lZCkgPyB0aGlzLl9nZXRNYXhDb2woKSA6IGNvbDtcclxuXHRcdHJvdyA9IChyb3cgPT0gdW5kZWZpbmVkKSA/IHRoaXMuX2dldE1heFJvdygpIDogcm93O1xyXG5cclxuXHRcdGxldCBtYXhDb2w6IG51bWJlciA9IE1hdGgubWF4KHRoaXMuX2N1ck1heENvbCwgY29sKTtcclxuXHRcdGxldCBtYXhSb3c6IG51bWJlciA9IE1hdGgubWF4KHRoaXMuX2N1ck1heFJvdywgcm93KTtcclxuXHRcdFxyXG5cdFx0aWYgKG1heENvbCAhPSB0aGlzLl9jdXJNYXhDb2wgfHwgbWF4Um93ICE9IHRoaXMuX2N1ck1heFJvdykge1xyXG5cdFx0XHR0aGlzLl9jdXJNYXhDb2wgPSBtYXhDb2w7XHJcblx0XHRcdHRoaXMuX2N1ck1heFJvdyA9IG1heFJvdztcclxuXHRcdFx0XHJcblx0XHRcdHRoaXMuX3JlbmRlcmVyLnNldEVsZW1lbnRTdHlsZSh0aGlzLl9uZ0VsLm5hdGl2ZUVsZW1lbnQsICd3aWR0aCcsICcxMDAlJyk7Ly8obWF4Q29sICogKHRoaXMuY29sV2lkdGggKyB0aGlzLm1hcmdpbkxlZnQgKyB0aGlzLm1hcmdpblJpZ2h0KSkrJ3B4Jyk7XHJcblx0XHRcdHRoaXMuX3JlbmRlcmVyLnNldEVsZW1lbnRTdHlsZSh0aGlzLl9uZ0VsLm5hdGl2ZUVsZW1lbnQsICdoZWlnaHQnLCAodGhpcy5fY3VyTWF4Um93ICogKHRoaXMucm93SGVpZ2h0ICsgdGhpcy5tYXJnaW5Ub3AgKyB0aGlzLm1hcmdpbkJvdHRvbSkpICsgJ3B4Jyk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF9nZXRNYXhSb3coKTogbnVtYmVyIHtcclxuXHRcdHJldHVybiBNYXRoLm1heC5hcHBseShudWxsLCB0aGlzLl9pdGVtcy5tYXAoKGl0ZW06IE5nR3JpZEl0ZW0pID0+IGl0ZW0uZ2V0R3JpZFBvc2l0aW9uKCkucm93ICsgaXRlbS5nZXRTaXplKCkueSAtIDEpKTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX2dldE1heENvbCgpOiBudW1iZXIge1xyXG5cdFx0cmV0dXJuIE1hdGgubWF4LmFwcGx5KG51bGwsIHRoaXMuX2l0ZW1zLm1hcCgoaXRlbTogTmdHcmlkSXRlbSkgPT4gaXRlbS5nZXRHcmlkUG9zaXRpb24oKS5jb2wgKyBpdGVtLmdldFNpemUoKS54IC0gMSkpO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfZ2V0TW91c2VQb3NpdGlvbihlOiBhbnkpOiBOZ0dyaWRSYXdQb3NpdGlvbiB7XHJcblx0XHRpZiAoKCg8YW55PndpbmRvdykuVG91Y2hFdmVudCAmJiBlIGluc3RhbmNlb2YgVG91Y2hFdmVudCkgfHwgKGUudG91Y2hlcyB8fCBlLmNoYW5nZWRUb3VjaGVzKSkge1xyXG5cdFx0XHRlID0gZS50b3VjaGVzLmxlbmd0aCA+IDAgPyBlLnRvdWNoZXNbMF0gOiBlLmNoYW5nZWRUb3VjaGVzWzBdO1xyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IHJlZlBvczogYW55ID0gdGhpcy5fbmdFbC5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cclxuXHRcdGxldCBsZWZ0OiBudW1iZXIgPSBlLmNsaWVudFggLSByZWZQb3MubGVmdDtcclxuXHRcdGxldCB0b3A6IG51bWJlciA9IGUuY2xpZW50WSAtIHJlZlBvcy50b3A7XHJcblxyXG5cdFx0aWYgKHRoaXMuY2FzY2FkZSA9PSAnZG93bicpIHRvcCA9IHJlZlBvcy50b3AgKyByZWZQb3MuaGVpZ2h0IC0gZS5jbGllbnRZO1xyXG5cdFx0aWYgKHRoaXMuY2FzY2FkZSA9PSAncmlnaHQnKSBsZWZ0ID0gcmVmUG9zLmxlZnQgKyByZWZQb3Mud2lkdGggLSBlLmNsaWVudFg7XHJcblx0XHRcclxuXHRcdGlmICh0aGlzLmlzRHJhZ2dpbmcgJiYgdGhpcy5fem9vbU9uRHJhZykge1xyXG5cdFx0XHRsZWZ0ICo9IDI7XHJcblx0XHRcdHRvcCAqPSAyO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRsZWZ0OiBsZWZ0LFxyXG5cdFx0XHR0b3A6IHRvcFxyXG5cdFx0fTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX2dldEFic29sdXRlTW91c2VQb3NpdGlvbihlOiBhbnkpOiBOZ0dyaWRSYXdQb3NpdGlvbiB7XHJcblx0XHRpZiAoKCg8YW55PndpbmRvdykuVG91Y2hFdmVudCAmJiBlIGluc3RhbmNlb2YgVG91Y2hFdmVudCkgfHwgKGUudG91Y2hlcyB8fCBlLmNoYW5nZWRUb3VjaGVzKSkge1xyXG5cdFx0XHRlID0gZS50b3VjaGVzLmxlbmd0aCA+IDAgPyBlLnRvdWNoZXNbMF0gOiBlLmNoYW5nZWRUb3VjaGVzWzBdO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGxlZnQ6IGUuY2xpZW50WCxcclxuXHRcdFx0dG9wOiBlLmNsaWVudFlcclxuXHRcdH07XHJcblx0fVxyXG5cdFxyXG5cdHByaXZhdGUgX2dldENvbnRhaW5lckNvbHVtbnMoKTogbnVtYmVyIHtcclxuXHRcdGNvbnN0IG1heFdpZHRoOiBudW1iZXIgPSB0aGlzLl9uZ0VsLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg7XHJcblx0XHRyZXR1cm4gTWF0aC5mbG9vcihtYXhXaWR0aCAvICh0aGlzLmNvbFdpZHRoICsgdGhpcy5tYXJnaW5MZWZ0ICsgdGhpcy5tYXJnaW5SaWdodCkpO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfZ2V0SXRlbUZyb21Qb3NpdGlvbihwb3NpdGlvbjogTmdHcmlkUmF3UG9zaXRpb24pOiBOZ0dyaWRJdGVtIHtcclxuXHRcdGZvciAobGV0IGl0ZW0gb2YgdGhpcy5faXRlbXMpIHtcclxuXHRcdFx0Y29uc3Qgc2l6ZTogTmdHcmlkSXRlbURpbWVuc2lvbnMgPSBpdGVtLmdldERpbWVuc2lvbnMoKTtcclxuXHRcdFx0Y29uc3QgcG9zOiBOZ0dyaWRSYXdQb3NpdGlvbiA9IGl0ZW0uZ2V0UG9zaXRpb24oKTtcclxuXHJcblx0XHRcdGlmIChwb3NpdGlvbi5sZWZ0ID4gKHBvcy5sZWZ0ICsgdGhpcy5tYXJnaW5MZWZ0KSAmJiBwb3NpdGlvbi5sZWZ0IDwgKHBvcy5sZWZ0ICsgdGhpcy5tYXJnaW5MZWZ0ICsgc2l6ZS53aWR0aCkgJiZcclxuXHRcdFx0XHRwb3NpdGlvbi50b3AgPiAocG9zLnRvcCArIHRoaXMubWFyZ2luVG9wKSAmJiBwb3NpdGlvbi50b3AgPCAocG9zLnRvcCArIHRoaXMubWFyZ2luVG9wICsgc2l6ZS5oZWlnaHQpKSB7XHJcblx0XHRcdFx0cmV0dXJuIGl0ZW07XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gbnVsbDtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX2NyZWF0ZVBsYWNlaG9sZGVyKGl0ZW06IE5nR3JpZEl0ZW0pOiB2b2lkIHtcclxuXHRcdGNvbnN0IHBvczogTmdHcmlkSXRlbVBvc2l0aW9uID0gaXRlbS5nZXRHcmlkUG9zaXRpb24oKTtcclxuXHRcdGNvbnN0IGRpbXM6IE5nR3JpZEl0ZW1TaXplID0gaXRlbS5nZXRTaXplKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGZhY3RvcnkgPSB0aGlzLmNvbXBvbmVudEZhY3RvcnlSZXNvbHZlci5yZXNvbHZlQ29tcG9uZW50RmFjdG9yeShOZ0dyaWRQbGFjZWhvbGRlcik7XHJcbiAgICAgICAgdmFyIGNvbXBvbmVudFJlZjogQ29tcG9uZW50UmVmPE5nR3JpZFBsYWNlaG9sZGVyPiA9IGl0ZW0uY29udGFpbmVyUmVmLmNyZWF0ZUNvbXBvbmVudChmYWN0b3J5KTtcclxuICAgICAgICB0aGlzLl9wbGFjZWhvbGRlclJlZiA9IGNvbXBvbmVudFJlZjtcclxuICAgICAgICBjb25zdCBwbGFjZWhvbGRlcjogTmdHcmlkUGxhY2Vob2xkZXIgPSBjb21wb25lbnRSZWYuaW5zdGFuY2U7XHJcbiAgICAgICAgcGxhY2Vob2xkZXIucmVnaXN0ZXJHcmlkKHRoaXMpO1xyXG4gICAgICAgIHBsYWNlaG9sZGVyLnNldENhc2NhZGVNb2RlKHRoaXMuY2FzY2FkZSk7XHJcbiAgICAgICAgcGxhY2Vob2xkZXIuc2V0R3JpZFBvc2l0aW9uKHsgY29sOiBwb3MuY29sLCByb3c6IHBvcy5yb3cgfSk7XHJcbiAgICAgICAgcGxhY2Vob2xkZXIuc2V0U2l6ZSh7IHg6IGRpbXMueCwgeTogZGltcy55IH0pO1xyXG5cdH1cclxufSJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
