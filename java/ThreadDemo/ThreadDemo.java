public class ThreadDemo {
   
   public static void main(String args[]) {
      
      System.out.println("Hello (on a thread) World (on another thread)!");
   
      Runnable objHello = new Runnable() {
         /* annoymous class implementing Runnable interface run() 
            method passed to Runnable */
         public void run() {
            for(int i=1; i<=5; i++) {
               System.out.println("Hello ");
               /* do some nice processing! */
               try { Thread.sleep(1000); } catch(Exception e){}
            }
         }                  
      };
      
      Runnable objWorld = new Runnable() {
         /* annoymous class with run() method passed to Runnable */
         public void run() {
            for(int i=1; i<=5; i++) {
               System.out.println("World");
               try { Thread.sleep(3000); } catch(Exception e){}
            }
         }                  
      };
      
      Thread threadHello = new Thread(objHello);
      Thread threadWorld = new Thread(objWorld);
      
      threadHello.start();
      try { Thread.sleep(1000); } catch(Exception e){}
      threadWorld.start();
      
//      System.out.println(threadHello.isAlive());
//      try { threadHello.sleep(1000); } catch(Exception e){}
      
      /* .join will force the calling thread to wait until it complete */
      try { threadHello.join(); } catch(Exception e){}
      try { threadWorld.join(); } catch(Exception e){}
      
      /* check if method is alive after join */
      System.out.println(threadHello.getName() + threadHello.isAlive());
      System.out.println(threadWorld.getName() +  threadWorld.isAlive());
      
      System.out.println("Time for poetry");
      
   }
}