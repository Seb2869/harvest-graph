import { SetControllerCall } from "../generated/Storage/StorageContract";
import { Controller } from "../generated/schema";
import { ControllerListener } from "../generated/templates";
import { getGovernance, getStore } from "./utils/Controller";

export function handleSetController(call: SetControllerCall): void {
  const controllerAddress = call.inputs._controller
  let controller = Controller.load(controllerAddress.toHex())
  if (controller == null) {
    controller = new Controller(controllerAddress.toHex())
    controller.timestamp = call.block.timestamp
    controller.createAtBlock = call.block.number
    controller.store = getStore(controllerAddress).toHex()
    controller.governance = getGovernance(controllerAddress).toHex()
    controller.save()
    ControllerListener.create(controllerAddress)
  }
}