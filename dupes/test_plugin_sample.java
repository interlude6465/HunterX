// Sample Plugin Code for Testing Continuous Scanner
// This file simulates a Minecraft plugin with potential vulnerabilities

package com.example.testplugin;

import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.player.PlayerDeathEvent;
import org.bukkit.event.entity.ItemSpawnEvent;
import org.bukkit.inventory.Inventory;
import org.bukkit.scheduler.BukkitRunnable;

public class TestPlugin implements Listener {
    
    // Vulnerability: Async inventory operations without synchronization
    @EventHandler
    public void onPlayerDeath(PlayerDeathEvent event) {
        new BukkitRunnable() {
            @Override
            public void run() {
                runTaskAsynchronously(plugin, () -> {
                    Inventory inv = event.getEntity().getInventory();
                    inv.setItem(0, null);
                    inv.addItem(new ItemStack(Material.DIAMOND, 64));
                });
            }
        }.runTaskLaterAsynchronously(plugin, 1L);
    }
    
    // Vulnerability: Event handler without permission checks
    @EventHandler
    public void onItemSpawn(ItemSpawnEvent event) {
        // No hasPermission or isOp check
        event.setCancelled(false);
        ItemStack item = event.getEntity().getItemStack();
        item.setAmount(item.getAmount() * 2); // Potential dupe
    }
    
    // Vulnerability: Packet handling without validation
    public void handleWindowClick(PacketPlayInWindowClick packet) {
        // No validation or rate limiting
        sendPacket(player, new PacketPlayOutSetSlot());
    }
    
    // Vulnerability: Transaction handling without rollback
    public void processTransaction(Player player, ItemStack item) {
        Transaction transaction = new Transaction();
        transaction.start();
        // Missing commit/rollback logic
        player.getInventory().addItem(item);
    }
}
