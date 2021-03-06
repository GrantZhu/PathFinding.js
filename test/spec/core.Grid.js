describe('core/Grid.js', function() {
    describe('generate without matrix', function() {
        var width, height, grid;

        beforeEach(function() {
            width = 10;
            height = 20;
            grid = new PF.Grid(width, height);
        });

        it('should be generated', function() {
            expect(typeof grid).toBe('object');
        });

        it('should have correct size', function() {
            expect(grid.width).toBe(width);
            expect(grid.height).toBe(height);

            expect(grid.nodes.length).toBe(height);
            for (var i = 0; i < height; ++i) {
                expect(grid.nodes[i].length).toBe(width); 
            }
        });

        it('should set all nodes\' walkable attribute', function() {
            for (var i = 0; i < height; ++i) {
                for (var j = 0; j < width; ++j) {
                    expect(grid.isWalkableAt(j, i)).toBeTruthy();
                }
            }
        });
    });

    describe('generate with matrix', function() {
        var matrix, grid, width, height;

        var enumPos = function(f, o) {
            for (var y = 0; y < height; ++y) {
                for (var x = 0; x < width; ++x) {
                    if (o) {
                        f.call(o, x, y, grid);
                    } else {
                        f(x, y, grid);
                    }
                }
            }
        };

        beforeEach(function() {
            matrix = [
                [1, 0, 0, 1],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 0, 0, 0],
                [1, 0, 0, 1],
            ];
            height = matrix.length;
            width = matrix[0].length;
            grid = new PF.Grid(width, height, matrix);
        });

        it('should be generated', function() {
            expect(typeof grid).toBe('object');
        });

        it('should have correct size', function() {
            expect(grid.width).toBe(width);
            expect(grid.height).toBe(height);

            expect(grid.nodes.length).toBe(height);
            for (var i = 0; i < height; ++i) {
                expect(grid.nodes[i].length).toBe(width); 
            }
        });

        it('should initiate all nodes\' walkable attribute', function() {
            enumPos(function(x, y, g) {
                if (matrix[y][x]) {
                    expect(g.isWalkableAt(x, y)).toBeFalsy();
                } else {
                    expect(g.isWalkableAt(x, y)).toBeTruthy();
                }
            });
        });

        it('should be able to set nodes\' walkable attribute', function() {
            enumPos(function(x, y) {
                grid.setWalkableAt(x, y, false); 
            });
            enumPos(function(x, y) {
                expect(grid.isWalkableAt(x, y)).toBeFalsy();
            })
            enumPos(function(x, y) {
                grid.setWalkableAt(x, y, true); 
            });
            enumPos(function(x, y) {
                expect(grid.isWalkableAt(x, y)).toBeTruthy();
            })
        });

        it('should return correct answer for position validity query', function() {
            var asserts = [
                [0, 0, true],
                [0, height - 1, true],
                [width - 1, 0, true],
                [width - 1, height - 1, true],
                [-1, -1, false],
                [0, -1, false],
                [-1, 0, false],
                [0, height, false],
                [width, 0, false],
                [width, height, false],
            ];
            
            asserts.forEach(function(v, i, a) {
                expect(grid.isInside(v[0], v[1])).toBe(v[2]);
            });
        });

        it('should be able to set and get arbitray attributes', function() {
            var attrs = {
                'a': 1,
                'b': 2,
                'c': 3,
                'd': 4,
                'e': 5,
            };

            enumPos(function(x, y) {
                for (var key in attrs) {
                    grid.setAttributeAt(x, y, key, attrs[key]);
                }
            });

            enumPos(function(x, y) {
                for (var key in attrs) {
                    expect(grid.getAttributeAt(x, y, key)).toBe(attrs[key]);
                }
            });
        });
    });
});
