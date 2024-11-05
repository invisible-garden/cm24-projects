import json
import os
import torch
from ezkl import ezkl
import model
from main import X_train_tensor, X_test_tensor

model_path = os.path.join('network.onnx')
compiled_model_path = os.path.join('network.compiled')
pk_path = os.path.join('test.pk')
vk_path = os.path.join('test.vk')
settings_path = os.path.join('settings.json')
witness_path = os.path.join('witness.json')
data_path = os.path.join('input.json')

best_model_path = "best_model.pth"
model.load_state_dict(torch.load(best_model_path))

torch.onnx.export(model,
                      X_train_tensor.unsqueeze(1),
                      model_path,
                      export_params=True,
                      opset_version=10,
                      do_constant_folding=True,
                      input_names = ['input'],
                      output_names = ['output'],
                      dynamic_axes={'input' : {0 : 'batch_size'},
                                    'output' : {0 : 'batch_size'}})

data_array = X_train_tensor.detach().numpy().tolist()

data = dict(input_data = data_array)

json.dump( data, open(data_path, 'w' ))

py_run_args = ezkl.PyRunArgs()
py_run_args.input_visibility = "private"
py_run_args.output_visibility = "public"
py_run_args.param_visibility = "fixed"

res = ezkl.gen_settings(model_path, settings_path, py_run_args=py_run_args)

cal_path = os.path.join("calibration.json")
json.dump(data, open(cal_path, 'w'))

data_array =X_test_tensor.detach().numpy()

data = dict(input_data = data_array.tolist())

json.dump( data, open(cal_path, 'w' ))

ezkl.calibrate_settings(cal_path, model_path, settings_path, "resources")

res = ezkl.compile_circuit(model_path, compiled_model_path, settings_path)

ezkl.get_srs( settings_path)

ezkl.gen_witness(data_path, compiled_model_path, witness_path)

ezkl.setup(
        compiled_model_path,
        vk_path,
        pk_path,
    )

proof_path = os.path.join('test.pf')

res = ezkl.prove(
        witness_path,
        compiled_model_path,
        pk_path,
        proof_path,
        "single",
    )

print(res)

res = ezkl.verify(
        proof_path,
        settings_path,
        vk_path,

    )

assert res == True
print("verified")