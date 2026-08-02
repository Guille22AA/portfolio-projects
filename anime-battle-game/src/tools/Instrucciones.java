package tools;
import java.util.InputMismatchException;
import  java.util.Scanner;

import anime_arena.Main_menu;

/**
 * Muestra las instrucciones del juego por consola.
 * <p>
 * El texto incluye:
 * <ul>
 *     <li>Explicación del sistema de combate</li>
 *     <li>Funcionamiento del maná y habilidades</li>
 *     <li>Descripción de cada efecto de habilidad</li>
 * </ul>
 * Tras la lectura, el usuario puede introducir <b>0</b> para volver
 * al menú principal.
 */
public class Instrucciones {
	
	public static void mostrarInstrucciones() {
		
		System.out.println("\n\n--INSTRUCCIONES--\n\nEscoge un personaje de entre la lista para combatir contra uno de ellos dirigido por la CPU. Cada personaje cuenta con estadísticas propias y un set de 4 habilidades diferentes. Cada habilidad gasta una determinada cantidad de maná, así que gestiona bien su uso, o solo podrás usar ataques básicos durante el resto del combate. De entre las 4 habilidades una es tu Ultimate, la cual podrás usar una única vez por combate. El primer personaje en quedarse sin vida, pierde la partida.\nEl combate funciona por rondas, y solo podrás hacer uso de una de tus habilidades en cada turno. Empieza el turno aquel personaje más rápido, auqnue la velocidad puede variar momentáneamente gracias a los efectos de algunas habilidades. Lista de efectos de habilidad:\n\n-Slow: reduce la velocidad del rival para el siguiente turno.\n-Escudo: bloquea una cantidad del daño de la próxima habilidad rival.\n-Heal: cura parte de tu vida restante, nunca por encima de la vida máxima base de tu personaje.\n-Bonus de velocidad: adquiere velocidad extra hasta el próximo turno.\n-Bonus de daño: aplica daño extra basado en el daño base del personaje enemigo.\n-Ejecutar: elimina al rival según el % de vida que le falte para ser derrotado.\n-Robar Ultimate: consiste en usar la Ultimate del personaje rival como si de la tuya se tratase.\n\n0.Volver\n");
	
	
		Scanner sc = new Scanner (System.in);
		int opcion;
	//excepcion por si se introduce un valor no númerico
	try {
		 opcion = sc.nextInt();
	}catch (InputMismatchException e) {
		System.err.println("Opción no válida\n");
		sc.nextLine(); //limpiar buffer
		mostrarInstrucciones();
		 return;
	}
	
	if(opcion == 0) {
		Main_menu.mostrarMenuMain(sc);
	}else {
		System.err.println("Opción no válida\n");
		mostrarInstrucciones();
	}
 }
}
