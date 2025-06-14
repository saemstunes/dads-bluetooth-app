
package app.lovable.dadsbluetoothapp;

import android.Manifest;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothManager;
import android.bluetooth.BluetoothProfile;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import androidx.core.app.ActivityCompat;

import com.getcapacitor.JSObject;
import com.getcapacitor.JSArray;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;

import java.util.Set;

@CapacitorPlugin(
    name = "BluetoothManager",
    permissions = {
        @Permission(strings = {Manifest.permission.BLUETOOTH}, alias = "bluetooth"),
        @Permission(strings = {Manifest.permission.BLUETOOTH_ADMIN}, alias = "bluetoothAdmin"),
        @Permission(strings = {Manifest.permission.BLUETOOTH_CONNECT}, alias = "bluetoothConnect"),
        @Permission(strings = {Manifest.permission.BLUETOOTH_SCAN}, alias = "bluetoothScan"),
        @Permission(strings = {Manifest.permission.ACCESS_FINE_LOCATION}, alias = "location")
    }
)
public class BluetoothManagerPlugin extends Plugin {

    private BluetoothAdapter bluetoothAdapter;
    private BluetoothManager bluetoothManager;

    @Override
    public void load() {
        bluetoothManager = (BluetoothManager) getContext().getSystemService(Context.BLUETOOTH_SERVICE);
        bluetoothAdapter = bluetoothManager.getAdapter();
        
        // Register for Bluetooth state changes
        IntentFilter filter = new IntentFilter();
        filter.addAction(BluetoothAdapter.ACTION_STATE_CHANGED);
        filter.addAction(BluetoothDevice.ACTION_FOUND);
        filter.addAction(BluetoothAdapter.ACTION_DISCOVERY_FINISHED);
        getContext().registerReceiver(bluetoothReceiver, filter);
    }

    @PluginMethod
    public void isBluetoothEnabled(PluginCall call) {
        boolean enabled = bluetoothAdapter != null && bluetoothAdapter.isEnabled();
        JSObject result = new JSObject();
        result.put("enabled", enabled);
        call.resolve(result);
    }

    @PluginMethod
    public void enableBluetooth(PluginCall call) {
        if (bluetoothAdapter == null || bluetoothAdapter.isEnabled()) {
            JSObject result = new JSObject();
            result.put("success", bluetoothAdapter != null && bluetoothAdapter.isEnabled());
            call.resolve(result);
            return;
        }

        if (ActivityCompat.checkSelfPermission(getContext(), Manifest.permission.BLUETOOTH_CONNECT) != PackageManager.PERMISSION_GRANTED) {
            call.reject("Bluetooth permission not granted");
            return;
        }

        boolean enabled = bluetoothAdapter.enable();
        JSObject result = new JSObject();
        result.put("success", enabled);
        call.resolve(result);
    }

    @PluginMethod
    public void getPairedDevices(PluginCall call) {
        if (bluetoothAdapter == null) {
            call.reject("Bluetooth not available");
            return;
        }

        if (ActivityCompat.checkSelfPermission(getContext(), Manifest.permission.BLUETOOTH_CONNECT) != PackageManager.PERMISSION_GRANTED) {
            call.reject("Bluetooth permission not granted");
            return;
        }

        Set<BluetoothDevice> pairedDevices = bluetoothAdapter.getBondedDevices();
        JSArray devicesArray = new JSArray();

        for (BluetoothDevice device : pairedDevices) {
            JSObject deviceObj = createDeviceObject(device);
            deviceObj.put("paired", true);
            devicesArray.put(deviceObj);
        }

        JSObject result = new JSObject();
        result.put("devices", devicesArray);
        call.resolve(result);
    }

    @PluginMethod
    public void scanForDevices(PluginCall call) {
        if (bluetoothAdapter == null) {
            call.reject("Bluetooth not available");
            return;
        }

        if (ActivityCompat.checkSelfPermission(getContext(), Manifest.permission.BLUETOOTH_SCAN) != PackageManager.PERMISSION_GRANTED) {
            call.reject("Bluetooth scan permission not granted");
            return;
        }

        if (bluetoothAdapter.isDiscovering()) {
            bluetoothAdapter.cancelDiscovery();
        }

        boolean started = bluetoothAdapter.startDiscovery();
        JSObject result = new JSObject();
        result.put("success", started);
        call.resolve(result);
    }

    @PluginMethod
    public void connectToDevice(PluginCall call) {
        String deviceId = call.getString("deviceId");
        if (deviceId == null) {
            call.reject("Device ID required");
            return;
        }

        // Implement device connection logic here
        // This would typically involve creating a BluetoothSocket and connecting
        JSObject result = new JSObject();
        result.put("success", true);
        call.resolve(result);
    }

    private JSObject createDeviceObject(BluetoothDevice device) {
        JSObject deviceObj = new JSObject();
        
        if (ActivityCompat.checkSelfPermission(getContext(), Manifest.permission.BLUETOOTH_CONNECT) == PackageManager.PERMISSION_GRANTED) {
            deviceObj.put("id", device.getAddress());
            deviceObj.put("name", device.getName() != null ? device.getName() : "Unknown Device");
            deviceObj.put("address", device.getAddress());
            deviceObj.put("type", getDeviceType(device));
            deviceObj.put("category", getDeviceCategory(device));
            deviceObj.put("connected", false);
            deviceObj.put("signalStrength", 75); // Would need RSSI scanning for real values
        }

        return deviceObj;
    }

    private String getDeviceType(BluetoothDevice device) {
        int deviceClass = device.getBluetoothClass().getDeviceClass();
        
        switch (deviceClass) {
            case 1032: // Audio/Video Headphones
            case 1048: // Audio/Video Handsfree
                return "audio";
            case 1056: // Audio/Video Car Audio
                return "car";
            case 516: // Phone Smart
                return "phone";
            case 1344: // Audio/Video Loudspeaker
                return "speaker";
            default:
                return "unknown";
        }
    }

    private String getDeviceCategory(BluetoothDevice device) {
        String name = "";
        if (ActivityCompat.checkSelfPermission(getContext(), Manifest.permission.BLUETOOTH_CONNECT) == PackageManager.PERMISSION_GRANTED) {
            name = device.getName() != null ? device.getName().toLowerCase() : "";
        }
        
        if (name.contains("car") || name.contains("mazda") || name.contains("toyota")) return "car";
        if (name.contains("headphone")) return "headphones";
        if (name.contains("buds") || name.contains("airpods")) return "earphones";
        if (name.contains("watch")) return "smartwatch";
        if (name.contains("phone")) return "phone";
        if (name.contains("speaker")) return "speaker";
        return "other";
    }

    private final BroadcastReceiver bluetoothReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            String action = intent.getAction();
            
            if (BluetoothDevice.ACTION_FOUND.equals(action)) {
                BluetoothDevice device = intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE);
                if (device != null) {
                    JSObject deviceObj = createDeviceObject(device);
                    notifyListeners("deviceFound", deviceObj);
                }
            } else if (BluetoothAdapter.ACTION_STATE_CHANGED.equals(action)) {
                int state = intent.getIntExtra(BluetoothAdapter.EXTRA_STATE, BluetoothAdapter.ERROR);
                JSObject stateObj = new JSObject();
                stateObj.put("state", state);
                stateObj.put("enabled", state == BluetoothAdapter.STATE_ON);
                notifyListeners("bluetoothStateChanged", stateObj);
            }
        }
    };

    @Override
    protected void handleOnDestroy() {
        getContext().unregisterReceiver(bluetoothReceiver);
    }
}
