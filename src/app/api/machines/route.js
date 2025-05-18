import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Machine from '@/models/Machine';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectDB();
    const machines = await Machine.find();

    // Transform the data to match the expected format
    const formattedMachines = machines.map(machine => ({
      id: machine._id.toString(),
      name: machine.name,
      type: machine.type,
      status: machine.status
    }));

    return NextResponse.json(formattedMachines);
  } catch (error) {
    console.error('[MACHINE_GET_ERROR]', error);
    return NextResponse.json({ message: 'Failed to fetch machines' }, { status: 500 });
  }
}

export async function PATCH(req) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'EMPLOYEE') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
    const { machineId, status } = await req.json();

    const updatedMachine = await Machine.findByIdAndUpdate(
      machineId,
      { status },
      { new: true }
    );

    if (!updatedMachine) {
      return NextResponse.json({ message: 'Machine not found' }, { status: 404 });
    }

    const formattedMachine = {
      id: updatedMachine._id.toString(),
      name: updatedMachine.name,
      type: updatedMachine.type,
      status: updatedMachine.status
    };

    return NextResponse.json({ message: 'Machine updated', machine: formattedMachine });
  } catch (error) {
    console.error('[MACHINE_PATCH_ERROR]', error);
    return NextResponse.json({ message: 'Failed to update machine' }, { status: 500 });
  }
}
