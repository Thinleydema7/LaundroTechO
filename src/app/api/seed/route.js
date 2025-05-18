import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Machine from '@/models/Machine';

export async function GET() {
  try {
    await connectDB();
    console.log('Starting seed process...');

    // Create test machines
    const testMachines = [
      {
        name: 'Washer 1',
        type: 'WASH_AND_FOLD',
        status: 'AVAILABLE'
      },
      {
        name: 'Washer 2',
        type: 'WASH_AND_FOLD',
        status: 'AVAILABLE'
      },
      {
        name: 'Dryer 1',
        type: 'DRY_CLEANING',
        status: 'AVAILABLE'
      },
      {
        name: 'Express Washer',
        type: 'EXPRESS',
        status: 'AVAILABLE'
      }
    ];

    const createdMachines = [];
    for (const machine of testMachines) {
      const existingMachine = await Machine.findOne({ name: machine.name });
      if (!existingMachine) {
        console.log(`Creating machine: ${machine.name}`);
        const newMachine = await Machine.create(machine);
        createdMachines.push(newMachine);
      } else {
        console.log(`Machine ${machine.name} already exists`);
        createdMachines.push(existingMachine);
      }
    }

    return NextResponse.json({
      message: 'Seed data created successfully',
      machines: createdMachines.map(machine => ({
        name: machine.name,
        type: machine.type,
        status: machine.status
      }))
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ 
      error: 'Failed to seed data',
      details: error.message 
    }, { 
      status: 500 
    });
  }
} 