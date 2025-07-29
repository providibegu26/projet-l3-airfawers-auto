const http = require('http');

function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 4000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(body);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (error) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function testAPI() {
  try {
    console.log('🧪 Test de l\'API...');
    
    // 1. Récupérer les véhicules
    console.log('\n📊 1. Récupération des véhicules...');
    const vehiclesResponse = await makeRequest('/api/admin/vehicules');
    console.log('Status:', vehiclesResponse.status);
    
    if (vehiclesResponse.status !== 200) {
      console.error('❌ Erreur récupération véhicules');
      return;
    }
    
    const vehicles = vehiclesResponse.data.vehicules;
    console.log('✅ Véhicules récupérés:', vehicles.length);
    
    if (vehicles.length === 0) {
      console.log('❌ Aucun véhicule trouvé');
      return;
    }
    
    const vehicle = vehicles[0];
    console.log('🚗 Premier véhicule:', {
      id: vehicle.id,
      immatriculation: vehicle.immatriculation,
      kilometrage: vehicle.kilometrage,
      weeklyKm: vehicle.weeklyKm,
      historiqueCount: vehicle.historiqueEntretiens?.length || 0
    });
    
    // 2. Valider un entretien
    console.log('\n🔧 2. Validation d\'un entretien...');
    const validationData = {
      vehiculeId: vehicle.id,
      type: 'vidange',
      kilometrage: vehicle.kilometrage,
      description: 'Test de validation'
    };
    
    const validationResponse = await makeRequest('/api/admin/entretiens/validate', 'POST', validationData);
    console.log('Status:', validationResponse.status);
    console.log('Response:', validationResponse.data);
    
    if (validationResponse.status !== 201) {
      console.error('❌ Erreur validation entretien');
      return;
    }
    
    // 3. Récupérer les véhicules mis à jour
    console.log('\n🔄 3. Récupération des véhicules mis à jour...');
    const updatedVehiclesResponse = await makeRequest('/api/admin/vehicules');
    console.log('Status:', updatedVehiclesResponse.status);
    
    const updatedVehicles = updatedVehiclesResponse.data.vehicules;
    const updatedVehicle = updatedVehicles.find(v => v.id === vehicle.id);
    
    console.log('✅ Véhicule mis à jour:', {
      immatriculation: updatedVehicle.immatriculation,
      kilometrage: updatedVehicle.kilometrage,
      historiqueCount: updatedVehicle.historiqueEntretiens?.length || 0,
      estimations: {
        vidangeNextThreshold: updatedVehicle.vidangeNextThreshold,
        vidangeDaysRemaining: updatedVehicle.vidangeDaysRemaining
      }
    });
    
    console.log('🎉 Test terminé avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

testAPI(); 