use std::error::Error;
use icicle_runtime::{Device, stream::IcicleStream};

pub fn init_device(backend_path: &str, device_id: i32) -> Result<(), Box<dyn Error>> {
    println!("Loading GPU backend from {}", backend_path);
    icicle_runtime::load_backend(backend_path)?;

    let device = Device::new("GPU", device_id);
    icicle_runtime::set_device(&device)?;

    println!("Successfully initialized GPU device {}", device_id);
    Ok(())
}

pub fn create_stream() -> Result<IcicleStream, Box<dyn Error>> {
    IcicleStream::create().map_err(|e| Box::new(e) as Box<dyn Error>)
}

pub struct GPUContext {
    pub stream: IcicleStream,
}

impl GPUContext {
    pub fn new(backend_path: &str, device_id: i32) -> Result<Self, Box<dyn Error>> {
        init_device(backend_path, device_id)?;
        let stream = create_stream()?;
        Ok(Self { stream })
    }
}

impl Drop for GPUContext {
    fn drop(&mut self) {
        if let Err(e) = self.stream.destroy() {
            eprintln!("Error destroying stream: {:?}", e);
        }
    }
}
