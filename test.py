import bpy
bpy.ops.transform.translate(
    value=(1.42627, 3.73953, 0.414056),
    orient_axis_ortho='X',
    orient_type='GLOBAL',
    orient_matrix=((1, 0, 0), (0, 1, 0), (0, 0, 1)),
    orient_matrix_type='GLOBAL',
    mirror=False,
    use_proportional_edit=False,
    proportional_edit_falloff='SMOOTH',
    proportional_size=1,
    use_proportional_connected=False,
    use_proportional_projected=False,
    snap=False,
    snap_elements={'INCREMENT'},
    use_snap_project=False,
    snap_target='CLOSEST',
    use_snap_self=True,
    use_snap_edit=True,
    use_snap_nonedit=True,
    use_snap_selectable=False
)

bpy.ops.transform.translate(
    value=(0, 0, 0),
    orient_axis_ortho='X',
    orient_type='GLOBAL',
    orient_matrix=((1, 0, 0), (0, 1, 0), (0, 0, 1)),
    orient_matrix_type='GLOBAL',
    constraint_axis=(True, True, True),
    mirror=False,
    use_proportional_edit=False,
    proportional_edit_falloff='SMOOTH',
    proportional_size=1,
    use_proportional_connected=False,
    use_proportional_projected=False,
    snap=False,
    snap_elements={'INCREMENT'},
    use_snap_project=False,
    snap_target='CLOSEST',
    use_snap_self=True,
    use_snap_edit=True,
    use_snap_nonedit=True,
    use_snap_selectable=False
)