---
title:  "Core Isolation Feature in STX4.0"
date:   2020-11-09 21:22:37 +0200
categories: ["rants", "STX"]
---

_StarlingX is continuing to evolve and update it's Real-time capabilities but documentation can be a bit sparse. This page is hopefully a placeholder for until we have a great documentation around the capabilities._

### Isolating CPU Cores
In a StarlingX cluster CPU isolation and Kernel commandline parameters are (generally) managed from the active controller through `system host-cpu-XXX` commands.

For isolation, we have the `Application-isolated` assigned_function.

Get current functions:

```console
$ system host-cpu-list controller-0
+--------------------------------------+----------+-----------+----------+--------+-----------------------------------------+-------------------+
| uuid                                 | log_core | processor | phy_core | thread | processor_model                         | assigned_function |
+--------------------------------------+----------+-----------+----------+--------+-----------------------------------------+-------------------+
| 65b8337e-08bf-4e32-b7e6-17505eaf0806 | 0        | 0         | 0        | 0      | Intel(R) Xeon(R) D-2146NT CPU @ 2.30GHz | Platform          |
| b7578ba2-cba0-46cd-b860-3ba5c03ba91d | 1        | 0         | 1        | 0      | Intel(R) Xeon(R) D-2146NT CPU @ 2.30GHz | Platform          |
| ff7447a2-00df-43db-8716-d1416faf89bc | 2        | 0         | 2        | 0      | Intel(R) Xeon(R) D-2146NT CPU @ 2.30GHz | Application       |
| 142796e5-b17d-48e9-b18a-b84c1ea5ae37 | 3        | 0         | 3        | 0      | Intel(R) Xeon(R) D-2146NT CPU @ 2.30GHz | Application       |
| c68a8dc7-367f-4512-84ca-ec559fbb63f4 | 4        | 0         | 4        | 0      | Intel(R) Xeon(R) D-2146NT CPU @ 2.30GHz | Application       |
| 15f360e2-d27c-4d9a-b0ff-0b78387eeb8c | 5        | 0         | 5        | 0      | Intel(R) Xeon(R) D-2146NT CPU @ 2.30GHz | Application       |
| 89274cb5-4fb5-4f5b-a8c5-ec36394b5ce5 | 6        | 0         | 6        | 0      | Intel(R) Xeon(R) D-2146NT CPU @ 2.30GHz | Application       |
| 33fb1e8e-77cd-4334-b061-dd40e6b7f7ba | 7        | 0         | 7        | 0      | Intel(R) Xeon(R) D-2146NT CPU @ 2.30GHz | Application       |
| 8c804a31-c61e-408c-83c4-3c7192a861d8 | 8        | 0         | 0        | 1      | Intel(R) Xeon(R) D-2146NT CPU @ 2.30GHz | Platform          |
| 560ad09d-48df-42ec-8588-7e739030d7e3 | 9        | 0         | 1        | 1      | Intel(R) Xeon(R) D-2146NT CPU @ 2.30GHz | Platform          |
| cbd83713-0118-4995-9810-486cfdbb912e | 10       | 0         | 2        | 1      | Intel(R) Xeon(R) D-2146NT CPU @ 2.30GHz | Application       |
| cb45713a-fa51-4628-b536-e3d5d57c891e | 11       | 0         | 3        | 1      | Intel(R) Xeon(R) D-2146NT CPU @ 2.30GHz | Application       |
| 28dff3de-9913-4055-89d5-09dfc084c3c1 | 12       | 0         | 4        | 1      | Intel(R) Xeon(R) D-2146NT CPU @ 2.30GHz | Application       |
| 98cf6c9e-2717-4f88-b487-487dbdadd18e | 13       | 0         | 5        | 1      | Intel(R) Xeon(R) D-2146NT CPU @ 2.30GHz | Application       |
| 73dcec10-7a62-4d07-ba23-3482d0e0f2af | 14       | 0         | 6        | 1      | Intel(R) Xeon(R) D-2146NT CPU @ 2.30GHz | Application       |
| 4a5a4477-f0db-4d77-9a6a-c77e5ca292e4 | 15       | 0         | 7        | 1      | Intel(R) Xeon(R) D-2146NT CPU @ 2.30GHz | Application       |
+--------------------------------------+----------+-----------+----------+--------+-----------------------------------------+-------------------+

```

The `system host-cpu-modify` command is used to modify the assigned function.

```console
$ system host-cpu-modify
usage: system host-cpu-modify [--nowrap] -f <function>
                              [-p0 <num_cores_on_processor0>]
                              [-p1 <num_cores_on_processor1>]
                              [-p2 <num_cores_on_processor2>]
                              [-p3 <num_cores_on_processor3>]
                              <hostnameorid>
```

For example, to set the 15th logical core to `Application-isolated`:

```console
$ system host-cpu-modify -f Application-isolated -p0 15 controller-1
```

### `stx-openstack`

One application that can make use of core isolation is `stx-openstack`. For example, if there are realtime VMs that require scheduling on isolated/dedicated cores, we need to set the `compute` key in the helm overrides (see OpenStack docs for: [`cpu_dedicated_set`](https://docs.openstack.org/nova/latest/configuration/config.html#compute.cpu_dedicated_set) and [`cpu_shared_set`](https://docs.openstack.org/nova/latest/configuration/config.html#compute.cpu_shared_set)).

Create a file for `nova` overrides that looks like this:

```yaml
conf:
  overrides:
    nova_compute:
      hosts:
      - conf:
          # DELETED FOR CONCISENESS
        name: controller-0
      - conf:
          # DELETED FOR CONCISENESS
        name: controller-1
      - conf:
          nova:
            DEFAULT:
              # NO CHANGE
            compute:
              cpu_dedicated_set: '"1-2"'
              cpu_shared_set: '"3-5"'
            libvirt:
              # NO CHANGE
            pci:
              passthrough_whitelist:
                # NO CHANGE
            vnc:
              # NO CHANGE
        name: worker
```

Then, run the following command to apply these overrides:

```console
$ # Update Helm overrides
$ system helm-override-update --values <yaml-file-with-overrides>.yaml stx-openstack nova openstack
$
$ # Apply application!!
$ system application-apply stx-openstack
```

Now, Openstack is able to schedule VMs on isolated CPU cores.


### OpenStack Flavor
The following properties should be added to the RT VM (hugepages not yet included)

```console
$ openstack flavor show rt.medium
+----------------------------+-----------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Field                      | Value                                                                                                                                                           |
+----------------------------+-----------------------------------------------------------------------------------------------------------------------------------------------------------------+
| OS-FLV-DISABLED:disabled   | False                                                                                                                                                           |
| OS-FLV-EXT-DATA:ephemeral  | 0                                                                                                                                                               |
| access_project_ids         | None                                                                                                                                                            |
| disk                       | 10                                                                                                                                                              |
| id                         | xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx                                                                                                                            |
| name                       | rt.medium                                                                                                                                                       |
| os-flavor-access:is_public | True                                                                                                                                                            |
| properties                 | hw:cpu_policy='dedicated', hw:cpu_realtime='yes', hw:cpu_realtime_mask='^0', hw:cpu_thread_policy='isolate', hw:emulator_threads_policy='share', hw:pmu='False' |
| ram                        | 2048                                                                                                                                                            |
| rxtx_factor                | 1.0                                                                                                                                                             |
| swap                       |                                                                                                                                                                 |
| vcpus                      | 2                                                                                                                                                               |
+----------------------------+-----------------------------------------------------------------------------------------------------------------------------------------------------------------+
```

Note on 2 vcpus: one will be used by linux and the other will be utilized by the RT program (`cyclictest` for instance)... You may use any number of vcpus ... just make sure that one vcpu is dedicated for linux.