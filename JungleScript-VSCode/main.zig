const std = @import("std");

// Define custom error categories
const AllocationError = error{
    OutOfMemory,
    InvalidSize,
};

fn allocateVirtualMemory(size: usize) AllocationError!void {
    if (size == 0) {
        return AllocationError.InvalidSize;
    }
    std.debug.print("Memory allocated successfully.\n", .{});
}

pub fn main() !void {
    std.debug.print("Starting task...\n", .{});
    
    // 'defer' ensures this executes when exiting the main block scope
    defer std.debug.print("Cleaned up resources and exited task safely.\n", .{});

    // 'try' evaluates the function call. If it returns an error, main exits and bubbles the error up
    try allocateVirtualMemory(1024);
    
    std.debug.print("Task logic executed.\n", .{});
}
